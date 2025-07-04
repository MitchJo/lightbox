const wifiControl = require('wifi-control');
const { wifiConstants } = require('../constants');
let mainWindow;

wifiControl.init({
    debug: true
});

exports.connectToWifi = (wifiAP) => {
    if (!mainWindow) throw new Error("Window Channel is not available");

    const { ssid } = wifiAP;

    if (!ssid) throw new Error("SSID is not empty");

    wifiControl.connectToAP(wifiAP, function (err, data) {

        if (err) mainWindow.webContents.send(wifiConstants.wifiEvent, {
            type: 'wifi-connect',
            status: false,
            error: err
        });

        if (data) mainWindow.webContents.send(wifiConstants.wifiEvent, {
            type: 'wifi-connect',
            status: true,
            data: {
                ...data,
                ssid
            }
        });

    });

    return 1;
}

exports.scanWifi = () => {
    if (!mainWindow) throw new Error("Window Channel is not available");

    wifiControl.scanForWiFi((err, data) => {

        if (err) mainWindow.webContents.send(wifiConstants.wifiEvent, {
            type: 'wifi-scan',
            status: false,
            error: err
        });

        if (data) {

            const { ssid } = wifiControl.getIfaceState();
            const { networks } = data;

            mainWindow.webContents.send(wifiConstants.wifiEvent, {
                type: 'wifi-scan',
                status: true,
                data: networks.filter((e) => e.ssid !== ssid)
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

        if (err) mainWindow.webContents.send(wifiConstants.wifiEvent, {
            type: 'wifi-reset',
            status: false,
            error: err
        });

        if (data) mainWindow.webContents.send(wifiConstants.wifiEvent, {
            type: 'wifi-reset',
            status: true,
            data: { ...data }
        });

    });
}

exports.initateDeviceProvision = (data) => {

    const { host, port, privateKey, rootCa, deviceCert, ssid, password } = data;

    if (!ssid) throw new ('SSID is missing.');
    if (!password) throw new ('Password is missing.');

    if (!host) throw new ('Host is missing.');
    if (!port) throw new ('Port is missing.');
    if (!privateKey) throw new ('Private Key is missing.');
    if (!rootCa) throw new ('Root CA is missing.');
    if (!deviceCert) throw new ('Device Certitifate is missing.');

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
                if (response.status !== 200) reject('Could not provision')
                return response.text();
            })
            .then(data => resolve(data))
            .catch(error => reject(error.message || 'Could not provision.'));

    })
}