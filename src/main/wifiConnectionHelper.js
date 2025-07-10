const wifiControl = require('wifi-control');
const { wifiConstants } = require('../constants');
const { writeLogs, generateLogData } = require('./fileLogger');
let mainWindow;


wifiControl.init({
    // debug: true
});

function stringifyWifiResponseData(data) {
    if (typeof (data) === 'string') return data;
    try {
        return JSON.stringify(data);
    } catch (e) {
        return e.message;
    }
}

exports.connectToWifi = (wifiAP) => {

    if (!mainWindow) {
        writeLogs('logs.txt', generateLogData('WIFI CONNECT', 'Window Channel is not available'))
        throw new Error("Window Channel is not available");
    }

    const { ssid } = wifiAP;

    if (!ssid) {
        writeLogs('logs.txt', generateLogData('WIFI CONNECT', 'SSID is empty'))
        throw new Error("SSID is empty");
    }

    const { success, ssid: connectedSSID, connection } = wifiControl.getIfaceState();

    if (success && connection === 'connected' && connectedSSID === ssid) {
        mainWindow.webContents.send(wifiConstants.wifiEvent, {
            type: 'wifi-connect',
            status: true,
            data: {
                ssid
            }
        });
        return 1;
    }

    wifiControl.connectToAP(wifiAP, function (err, data) {

        if (err) {
            writeLogs('logs.txt', generateLogData('WIFI CONNECT', stringifyWifiResponseData(err)))

            mainWindow.webContents.send(wifiConstants.wifiEvent, {
                type: 'wifi-connect',
                status: false,
                error: err
            });

        }

        if (data) {
            writeLogs('logs.txt', generateLogData('WIFI CONNECT', stringifyWifiResponseData(data)))
            mainWindow.webContents.send(wifiConstants.wifiEvent, {
                type: 'wifi-connect',
                status: true,
                data: {
                    ...data,
                    ssid
                }
            });
        }

    });

    return 1;
}

exports.scanWifi = () => {
    if (!mainWindow) throw new Error("Window Channel is not available");

    wifiControl.scanForWiFi((err, data) => {

        if (err) {
            writeLogs('logs.txt', generateLogData('WIFI SCAN', stringifyWifiResponseData(err)))

            mainWindow.webContents.send(wifiConstants.wifiEvent, {
                type: 'wifi-scan',
                status: false,
                error: err
            });
        }

        if (data) {

            const { ssid } = wifiControl.getIfaceState();
            const { networks } = data;

            writeLogs('logs.txt', generateLogData('WIFI SCAN', "Scan successful.."))

            mainWindow.webContents.send(wifiConstants.wifiEvent, {
                type: 'wifi-scan',
                status: true,
                data: networks?.filter((e) => e.ssid !== ssid) || []
            });

        }


    })

    return 1;
}

exports.disconnectWifi = () => {

}

exports.getCurrentWifi = () => {
    return wifiControl.getIfaceState();
}

exports.setMainWindow = (mw) => {
    mainWindow = mw;
}


exports.resetWifi = () => {
    if (!mainWindow) throw new Error("Window Channel is not available");
    wifiControl.resetWiFi((err, data) => {

        if (err) {
            writeLogs('logs.txt', generateLogData('WIFI Reset', stringifyWifiResponseData(err)))

            mainWindow.webContents.send(wifiConstants.wifiEvent, {
                type: 'wifi-reset',
                status: false,
                error: err
            });
        }

        if (data) {
            writeLogs('logs.txt', generateLogData('WIFI Reset', stringifyWifiResponseData(data)))

            mainWindow.webContents.send(wifiConstants.wifiEvent, {
                type: 'wifi-reset',
                status: true,
                data: { ...data }
            });
        }

    });
}

exports.initateDeviceProvision = (data) => {

    const { host, port, privateKey, rootCa, deviceCert, ssid, password } = data;

    if (!ssid) {
        writeLogs('logs.txt', generateLogData('Provisioning', 'Payload - SSID is missing'))
        throw new ('SSID is missing.');
    }
    if (!password) {
        writeLogs('logs.txt', generateLogData('Provisioning', 'Payload - Password is missing'))
        throw new ('Password is missing.');
    }

    if (!host) {
        writeLogs('logs.txt', generateLogData('Provisioning', 'Payload - Host is missing'))
        throw new ('Host is missing.');
    }

    if (!port) {
        writeLogs('logs.txt', generateLogData('Provisioning', 'Payload - Port is missing'))
        throw new ('Port is missing.');
    }

    if (!privateKey) {
        writeLogs('logs.txt', generateLogData('Provisioning', 'Payload - Priivate-Key is missing'))
        throw new ('Private Key is missing.');
    }

    if (!rootCa) {
        writeLogs('logs.txt', generateLogData('Provisioning', 'Payload - RootCA is missing'))
        throw new ('Root CA is missing.');
    }
    if (!deviceCert) {
        writeLogs('logs.txt', generateLogData('Provisioning', 'Payload - Device Certificate is missing'))
        throw new ('Device Certitifate is missing.');
    }

    return new Promise((resolve, reject) => {

        const payload = new URLSearchParams();

        payload.append('wifiSsid', ssid);
        payload.append('wifiPassword', password);
        payload.append('mqttHost', host);
        payload.append('mqttPort', port);
        payload.append('mqttPrivateKey', privateKey);
        payload.append('mqttClientCert', deviceCert);
        payload.append('mqttCaCert', rootCa);

        fetch(wifiConstants.provisionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: payload,
        })
            .then(response => {
                if (response.status !== 200) {
                    writeLogs('logs.txt', generateLogData('Provisioning', `Returned ${response.status}. Provision error.`))
                    reject('Could not provision') 
                }
                return response.text();
            })
            .then(data => {
                writeLogs('logs.txt', generateLogData('Provisioning', data || 'Provision success.'))
                resolve(data)
            })
            .catch(error => {
                writeLogs('logs.txt', generateLogData('Provisioning', error.message || 'Could not provision.'))
                reject(error.message || 'Could not provision.') 
            });

    })
}