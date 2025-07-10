const mqtt = require('mqtt');
const fs = require('fs');

const { mqttConstants } = require('../constants');
const { getRandomId } = require('../utils/random');
const { writeLogs, generateLogData } = require('./fileLogger');
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

    if (!parameters) {
        writeLogs('logs.txt', generateLogData('MQTT CONNECT' ,'Could not find mainWindow') )
        throw new Error("Invalid Parameters");
    }

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

    writeLogs('logs.txt', generateLogData('MQTT CONNECT', `Establishing connection to: ${options.host}:${options.port}`) )

    client.on('connect', () => {
        
        if (!mainWindow) {
            writeLogs('logs.txt', generateLogData('MQTT On Connect','Could not find mainWindow') )
            throw new Error("Main window channel not available");
        };

        writeLogs('logs.txt', generateLogData('MQTT On Connect', `Connection established`) )


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

        if (!mainWindow) {
            writeLogs('logs.txt', generateLogData('MQTT On DISCONNECT','Could not find mainWindow') )
            return
        }

        writeLogs('logs.txt', generateLogData('MQTT On DISCONNECT','Connection disconnected.') )

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
        
        if (!mainWindow) {
            writeLogs('logs.txt', generateLogData('MQTT On ERROR','Could not find mainWindow') )
            return
        }

        writeLogs('logs.txt', generateLogData('MQTT On ERROR',err || 'MQTT connection error') )

        mainWindow.webContents.send(mqttConstants.MqttStatus, {
            type: 'connection',
            data: {
                listenerType: 'error',
                message: err,
                connected: false
            }
        });

    });

    client.on('close', () => {
        if (!mainWindow) {
            writeLogs('logs.txt', generateLogData('MQTT On Close','Could not find mainWindow') )
            return
        }

        writeLogs('logs.txt', generateLogData('MQTT On Close',"MQTT Connection close") )

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

        if (!mainWindow) {
            writeLogs('logs.txt', generateLogData('MQTT On Message','Could not find mainWindow') )
            return
        }

        writeLogs('logs.txt', generateLogData('MQTT On Message', `Recieved messaged on ${topic} with payload: ${JSON.stringify(payload) }`) )

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
    if (!client) {
        writeLogs('logs.txt', generateLogData('MQTT Subscribe','Could not find client') )
        return
    };

    client.subscribe(topic, { qos: 1 }, (err) => {
        if (!mainWindow) {
            writeLogs('logs.txt', generateLogData('MQTT Subscribe','Could not find mainWindow') )
            return
        }

        const message = err ? `Could not subscribed to topic: ${topic}` : `Subscribed to topic: ${topic}`

        writeLogs('logs.txt', generateLogData('MQTT Subscribe', message ) )

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
    if (!client) {
        writeLogs('logs.txt', generateLogData('MQTT UnSubscribe','Could not find client') )
        return
    };

    client.unsubscribe(topic, (err) => {

        if (!mainWindow) {
            writeLogs('logs.txt', generateLogData('MQTT UnSubscribe','Could not find mainWindow') )
            return
        }


        const message = err ? `Could not Unsubscribed from topic: ${topic}` : `Successfully UnSubscribed from topic: ${topic}`

        writeLogs('logs.txt', generateLogData('MQTT UnSubscribe', message) )

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

    if (!client) {
        writeLogs('logs.txt', generateLogData('MQTT Publish','Could not find client') )
        throw new Error("Client was not initialized");
    }

    if (!data) {
        writeLogs('logs.txt', generateLogData('MQTT Publish','Data is not available') )
        throw new Error("Data is not available"); 
    }

    const parsedData = parsePublishData(data);
    if(!parsedData) {
        writeLogs('logs.txt', generateLogData('MQTT Publish','Cannot parse Publish data') )
        throw new Error("Could not parsed data to publish.");
    }

    const { topic, payload } = parsedData;
    
    if(!topic) {
        writeLogs('logs.txt', generateLogData('MQTT Publish', 'Cannot parse topic') )
        throw new Error("Could not parsed topic to publish.");
    } 

    if(!payload) {
        writeLogs('logs.txt', generateLogData('MQTT Publish', 'Cannot parse payload') )
        throw new Error("Could not parsed payload to publish.");
    } 

    const payloadString = JSON.stringify(payload);

    client.publish(topic, payloadString, (err) => {

        if (!mainWindow) {
            writeLogs('logs.txt', generateLogData('MQTT Publish', 'mainWindow is not available') )
            return;
        } 

        const message = err ? `Failed to publish: ${payloadString}` : `Successfully Published: ${payloadString}`

        writeLogs('logs.txt', generateLogData('MQTT Publish', message ) )

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