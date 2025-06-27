const mqtt = require('mqtt');
const fs = require('fs');

const { mqttConstants } = require('../constants');
const { getRandomId } = require('../utils/random');
let mainWindow;
let client;

function parsePublishData(data) {
    try{
        return JSON.parse(data);
    }catch(e){
        return null;
    }
}

exports.mqttConnect = (parameters) => {

    if (!parameters) throw new Error("Invalid Parameters");

    const options = {
        protocol: parameters.protocol,
        host: parameters.host,
        port: parameters.port,
        ca: fs.readFileSync(parameters.rootCa),
        cert: fs.readFileSync(parameters.deviceCert),
        key: fs.readFileSync(parameters.privateKey),
        clientId: getRandomId('client'),
    };

    client = mqtt.connect(options);

    client.on('connect', () => {
        if (!mainWindow) return;
        mainWindow.webContents.send(mqttConstants.MqttStatus, {
            type: 'connection',
            data: {
                connected: true,
                listenerType: 'connect',
                message: 'Mqtt connected'
            }
        });
    });

    client.on('disconnect', () => {
        if (!mainWindow) return;
        mainWindow.webContents.send(mqttConstants.MqttStatus, {
            type: 'connection',
            data: {
                connected: false,
                listenerType: 'connect',
                message: 'Mqtt disconnected'
            }
        });
    });

    client.on('error', (err) => {
        if (!mainWindow) return;
        console.error('MQTT connection error:', err);

        mainWindow.webContents.send(mqttConstants.MqttStatus, {
            type: 'connection',
            data: {
                listenerType: 'error',
                message: err
            }
        });
    });

    client.on('close', () => {
        if (!mainWindow) return;

        mainWindow.webContents.send(mqttConstants.MqttStatus, {
            type: 'connection',
            data: {
                listenerType: 'close',
                message: 'Connection closed',
                connected: false
            }
        });

    });

    client.on('message', (topic, payload) => {

        if (!mainWindow) return;

        mainWindow.webContents.send(mqttConstants.MqttStatus, {
            type: 'message',
            data: {
                listenerType: 'message',
                message: `Recieved messaged on ${topic} with payload: ${payload}`,
                topic,
                payload
            }
        });

    });

    return 1;

}

exports.mqttDisconnect = () => {
    if (!client) throw new Error("Client was not initialized");
    ;
    client.end();

    return 1;
}

exports.mqttSubscribe = (topic) => {
    if (!client) return;

    client.subscribe(topic, { qos: 1 }, (err) => {
        if (!mainWindow) return;

        const message = err ? `Could not subscribed to topic: ${topic}` : `Subscribed to topic: ${topic}`

        mainWindow.webContents.send(mqttConstants.MqttStatus, {
            type: 'subscription',
            data: {
                listenerType: 'subscribed',
                message,
                subscribed: err ? false : true
            }
        });

    })
}

exports.mqttUnSubscribed = (topic) => {
    if (!client) return;

    client.unsubscribe(topic, (err) => {
        if (!mainWindow) return;

        const message = err ? `Could not Unsubscribed from topic: ${topic}` : `Successfully UnSubscribed from topic: ${topic}`

        mainWindow.webContents.send(mqttConstants.MqttStatus, {
            type: 'subscription',
            data: {
                listenerType: 'unsubscribed',
                message,
                subscribed: err ? false : true
            }
        });

    });

}

exports.mqttPublish = (data) => {

    if (!client) throw new Error("Client was not initialized");
    if (!data) throw new Error("Data is not available");

    const parsedData = parsePublishData(data);
    if(!parsedData) throw new Error("Could not parsed data to publish.");

    const { topic, payload } = parsedData;
    
    if(!topic) throw new Error("Could not parsed topic to publish.");
    if(!payload) throw new Error("Could not parsed payload to publish.");

    client.publish(topic, JSON.stringify(payload), (err) => {
        if (!mainWindow) return;

        const message = err ? `Failed to publish` : 'Successfully Published'

        mainWindow.webContents.send(mqttConstants.MqttStatus, {
            type: 'publish',
            data: {
                listenerType: 'publish',
                message,
                published: err ? false : true
            }
        });

    });
    return 1;
}

exports.setMainWindow = (win) => {
    mainWindow = win;
}

