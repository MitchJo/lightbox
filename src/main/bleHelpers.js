const { withBindings } = require('@stoprocent/noble');
const { bleConstants } = require('../constants');
const { writeLogs, generateLogData } = require('./fileLogger');
const noble = withBindings('win'); // 'hci', 'win', 'mac'

let BLEDevices = new Map([]);
let ConnectedDevice;
let mainWindow;

function bufferToUintArray(buf) {
    console.log(typeof (buf))
    try {
        return buf.toString();
    } catch (e) {
        console.log(e)
        return buf;
    }
}

async function handleDiscovery(peripheral) {

    console.log(
        `Peripheral discovered (${peripheral.id}):
        - Address: ${peripheral.address} (${peripheral.addressType})
        - Connectable: ${peripheral.connectable}
        - Scannable: ${peripheral.scannable}
        - RSSI: ${peripheral.rssi}`
    );

    if (!peripheral.advertisement?.localName) return;

    if (peripheral.advertisement.localName.includes('ESP')) {
        if (!mainWindow) {
            writeLogs('logs.txt', generateLogData('BLE Scan', 'Could not find mainWindow'))
            return
        }

        BLEDevices.set(peripheral.id, peripheral);

        writeLogs('logs.txt', generateLogData('BLE Scan', `Found device:${peripheral.id}`))

        mainWindow.webContents.send(bleConstants.BLEEvents, {
            type: 'scan',
            data: {
                id: peripheral.id,
                name: peripheral.advertisement.localName || 'No Name'
            }
        });

    }

}

async function disconnectDevice() {
    if (!ConnectedDevice) return;
    try {
        await ConnectedDevice.disconnectAsync();
    } catch (e) {
        throw new Error(e.message || 'Cannot disconnect');
    }
}

async function exploreServices(peripheral) {
    // Discover all services and characteristics at once
    const { services } = await peripheral.discoverAllServicesAndCharacteristicsAsync();

    const results = [];

    for (const service of services) {
        const serviceInfo = {
            uuid: service.uuid,
            characteristics: []
        };

        for (const characteristic of service.characteristics) {
            const characteristicInfo = {
                uuid: characteristic.uuid,
                properties: characteristic.properties
            };

            // Read the characteristic if it's readable
            // if (characteristic.properties.includes('notify')) {

            //     console.log('Notify characteristics', service.uuid, characteristic.uuid);

            //     characteristic.on('data', (data, isNotification) => {

            //         console.log(`Received ${isNotification ? 'notification' : 'read response'}: ${data}`);

            //         if (isNotification) mainWindow.webContents.send(bleConstants.BLEEvents, {
            //             type: 'ble-notification',
            //             data
            //         });

            //     });

            //     // await characteristic.subscribeAsync();


            // }

            serviceInfo.characteristics.push(characteristicInfo);
        }

        results.push(serviceInfo);
    }

    return results;
}

async function getCharacteristic(peripheral, data) {
    console.log(data);
    if (!data) return;

    const { service: serviceUUID, characteristic: characteristicUUID } = data || {};
    if (!serviceUUID && !characteristicUUID) return;

    const { services } = await peripheral.discoverAllServicesAndCharacteristicsAsync();

    for (const service of services) {
        console.log('Service:', service.uuid);
        if (service.uuid === serviceUUID) {
            for (const characteristic of service.characteristics) {
                console.log("Characteristic", characteristic.uuid);

                if (characteristic.uuid === characteristicUUID) {

                    const descriptors = await characteristic.discoverDescriptorsAsync();
                    const cccd = descriptors.find(d => d.uuid === '2902');

                    if (cccd) return characteristic;

                }
            }
        }
    }

    return;
}

exports.bleStartScan = async () => {

    BLEDevices.clear();

    try {

        await noble.waitForPoweredOnAsync();

        await noble.startScanningAsync([], false);

        noble.on('discover', handleDiscovery)

    } catch (error) {
        writeLogs('logs.txt', generateLogData('BLE Scan', `Error: ${error.message || 'Discovery error'}`))
        await noble.stopScanningAsync();
    }

}

exports.bleStopScan = async () => {
    try {
        await noble.stopScanningAsync();
        writeLogs('logs.txt', generateLogData('BLE STOP Scan', `Scan Stopped`))
        return 'OK';
    } catch (e) {
        writeLogs('logs.txt', generateLogData('BLE STOP Scan', `Scan Stopped Error: ${e.message}`))
        throw new Error(e.message)
    }
}

exports.bleConnect = async (peripheralId) => {

    await disconnectDevice();

    if (!mainWindow) {
        writeLogs('logs.txt', generateLogData('BLE Scan', 'Could not find mainWindow'))
        throw new Error('Main window not available...')
    }


    try {
        await noble.stopScanningAsync();

        const peripheral = BLEDevices.get(peripheralId);
        if (!peripheral) throw new Error(`No such Device ${peripheralId}`);

        BLEDevices.clear();

        peripheral.on("connect", (err) => {
            if (err) throw new Error(err);
            console.log('Connected')
            ConnectedDevice = peripheral;

            mainWindow.webContents.send(bleConstants.BLEEvents, {
                type: 'connection',
                data: {
                    connected: true,
                    id: peripheral.id
                }
            });

        });

        peripheral.on("disconnect", (err) => {
            if (err) throw new Error(err);
            console.log('Disconnected')
            ConnectedDevice = undefined;

            mainWindow.webContents.send(bleConstants.BLEEvents, {
                type: 'connection',
                data: {
                    connected: false,
                    id: peripheral.id
                }
            });

        });

        await peripheral.connectAsync();

        const services = await exploreServices(peripheral);

        if (services) mainWindow.webContents.send(bleConstants.BLEEvents, {
            type: 'bleServiceCharacteristics',
            data: services
        });

    } catch (e) {
        console.log(e.message)
        throw new Error(e.message);
    }
}

exports.bleDisconnect = async () => {
    return await disconnectDevice();
}

exports.bleSubscribe = async (data) => {

    if (!mainWindow) {
        writeLogs('logs.txt', generateLogData('BLE Subscribe', 'Could not find mainWindow'))
        throw new Error('Main window not available...')
    }

    if (!ConnectedDevice) throw new Error("Device not available");

    const characteristic = await getCharacteristic(ConnectedDevice, data);

    if (!characteristic) throw new Error("No such characteristic is available: " + JSON.stringify(data));

    if (!characteristic.properties.includes('notify')) throw new Error("Cannot subscribe to: " + JSON.stringify(data));


    try {

        characteristic.on('data', (data, isNotification) => {

            console.log(`Received ${isNotification ? 'notification' : 'read response'}: ${data}`);

            if (isNotification) mainWindow.webContents.send(bleConstants.BLEEvents, {
                type: 'ble-notification',
                data: bufferToUintArray(data)
            });

        });

        await characteristic.subscribeAsync();

        console.log('Successfully Subscribed');

        writeLogs('logs.txt', generateLogData('BLE Subscribe', 'Successfully subscribed to ' + JSON.stringify(data)))

        return 'OK';

    } catch (error) {
        console.log(error);

        writeLogs('logs.txt', generateLogData('BLE Subscribe', `Error: ${error?.message}`))
        throw new Error(error?.message || 'cannot subscribe');

    }

}

exports.bleUnsubscribe = async (data) => {

    console.log('Unsubscribe Data', data);

    if (!mainWindow) {
        writeLogs('logs.txt', generateLogData('BLE Unsubscribe', 'Could not find mainWindow'))
        throw new Error('Main window not available...')
    }

    if (!ConnectedDevice) throw new Error("Device not available");

    const characteristic = await getCharacteristic(ConnectedDevice, data);

    if (!characteristic) throw new Error("No such characteristic is available: " + JSON.stringify(data));

    if (!characteristic.properties.includes('notify')) throw new Error("Cannot unsubscribe from: " + JSON.stringify(data));

    try {

        await characteristic.unsubscribeAsync();
        writeLogs('logs.txt', generateLogData('BLE Unsubscribe', 'Successfully Unsubscribed from ' + JSON.stringify(data)))
        return 'OK';

    } catch (e) {
        console.log(e)
        writeLogs('logs.txt', generateLogData('BLE Unsubscribe', `Error: ${e?.message || 'Cannor unsubscribe'}`))
        throw new Error(e?.message || 'Cannot unsubscribe');
    }

}

exports.bleWrite = async (data) => {
    const {writeData} = data;
    
    if(!writeData) {
        writeLogs('logs.txt', generateLogData('BLE Write', 'No data to write'))
        throw new Error('No data to write.')
    }

    if (!mainWindow) {
        writeLogs('logs.txt', generateLogData('BLE Write', 'Could not find mainWindow'))
        throw new Error('Main window not available...')
    }

    if (!ConnectedDevice) throw new Error("Device not available");

    const characteristic = await getCharacteristic(ConnectedDevice, data);

    if (!characteristic) throw new Error("No such characteristic is available: " + JSON.stringify(data));

    if (!characteristic.properties.includes('write')) throw new Error("Cannot write to: " + JSON.stringify(data));

    try {

        characteristic.on('write', (error) => {
            if(error){
                writeLogs('logs.txt', generateLogData('BLE Write', `Error: ${error}`))
                return;
            }
            writeLogs('logs.txt', generateLogData('BLE Write', `Written successfully`))
        });

        await characteristic.writeAsync( Buffer.from(writeData,'utf-8') , false);

    } catch (e) {
        writeLogs('logs.txt', generateLogData('BLE Write', `Error: ${e?.message}`))
        throw new Error(e?.message || 'cannot write');
    }
}

exports.bleCleanUp = async () => {
    try {
        console.log('\nCleaning up...');
        BLEDevices.clear();
        ConnectedDevice = null;
        await noble.stopScanningAsync();
        noble.stop();
        console.log('noble stopped');
    } catch (e) {

    }
}

exports.setMainWindow = (win) => {
    mainWindow = win;
}