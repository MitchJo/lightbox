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
                ...data
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
            data: {...data}
        });

    });
}