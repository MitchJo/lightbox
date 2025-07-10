const fs = require('fs');
const path = require('path');
const { fileConstants } = require('../constants');
const { writeLogs, generateLogData } = require('./fileLogger');

function validateConfiguration(config) {
    if (!config) {
        writeLogs('logs.txt', generateLogData('Config validation' ,'Could not find config file') )
        return
    };
    let configJson = {};

    try {
        configJson = JSON.parse(config);
    } catch (e) {
        writeLogs('logs.txt', generateLogData('Config validation' ,e.message || 'Could not parse config') )
        return null;
    }

    if (!configJson?.host && !configJson.host.length) {
        writeLogs('logs.txt', generateLogData('Config validation', 'Invalid host') )
        return
    };

    if (!configJson?.protocol && !configJson.protocol.length) {
        writeLogs('logs.txt', generateLogData('Config validation','Invalid protocol') )
        return
    };

    if (!configJson?.port && !configJson.port.length) {
        writeLogs('logs.txt', generateLogData('Config validation','Invalid port') )
        return
    };

    if (!configJson?.privateKey && !configJson.privateKey.length) {
        writeLogs('logs.txt', generateLogData('Config validation','Invalid private key') )
        return
    };
    if (!configJson?.rootCa && !configJson.rootCa.length) {
        writeLogs('logs.txt', generateLogData('Config validation','Invalid root ca') )
        return
    };
    if (!configJson?.deviceCert && !configJson.deviceCert.length) {
        writeLogs('logs.txt', generateLogData('Config validation','Invalid device certificate') )
        return
    };


    if (!fs.existsSync(configJson.privateKey)) {
        writeLogs('logs.txt', generateLogData('Config validation' ,'Private key does not exist') )
        return
    };
    if (!fs.existsSync(configJson.rootCa)) {
        writeLogs('logs.txt', generateLogData('Config validation', 'Root CA does not exist') )
        return
    };
    if (!fs.existsSync(configJson.deviceCert)) {
        writeLogs('logs.txt', generateLogData('Config validation','Device certificate does not exist') )
        return
    };

    configJson.port = parseInt(configJson.port)

    writeLogs('logs.txt', generateLogData('Config validation','Configuration is valid. Proceed...') )

    return configJson;
}

exports.setConfigurations = (appDir, parameters) => {

    const directoryPath = path.join(appDir, 'configurationFiles')

    fs.mkdirSync(directoryPath, { recursive: true });

    const { privateKey, rootCa, deviceCert, ...others } = parameters;

    const privateKeyPath = path.join(directoryPath, `privateKey.pem`)
    if (privateKey instanceof ArrayBuffer) fs.writeFileSync(privateKeyPath, Buffer.from(privateKey));

    const rootCaPath = path.join(directoryPath, `rootCa.pem`)
    if (rootCa instanceof ArrayBuffer) fs.writeFileSync(`${directoryPath}/rootCa.pem`, Buffer.from(rootCa));

    const deviceCertPath = path.join(directoryPath, `deviceCert.crt`)
    if (deviceCert instanceof ArrayBuffer) fs.writeFileSync(deviceCertPath, Buffer.from(deviceCert));

    if (!fs.existsSync(privateKeyPath)) {
        writeLogs('logs.txt', generateLogData('Config write' ,'Private key is required!!!') )
        throw new Error('Private key is required!!!')
    }
    
    if (!fs.existsSync(rootCaPath)) {
        writeLogs('logs.txt', generateLogData('Config write' ,'Root Certificate Authority is required!!!') )
        throw new Error('Root Certificate Authority is required!!!')
    }
        
    if (!fs.existsSync(deviceCertPath)) {
        writeLogs('logs.txt', generateLogData('Config write' ,'Device certificate is required!!!') )
        throw new Error('Device certificate is required!!!')
    } 
                
    const jsonContent = JSON.stringify({ ...others, rootCa: rootCaPath, privateKey: privateKeyPath, deviceCert: deviceCertPath })
    fs.writeFileSync(`${directoryPath}/config.json`, jsonContent);
    
    writeLogs('logs.txt', generateLogData('Config write','Successfully written...') )
    
    return jsonContent;

}

exports.getConfigurations = async (appDir) => {
    const directoryPath = path.join(appDir, 'configurationFiles');

    try {
        const configJson = fs.readFileSync(`${directoryPath}/config.json`, { encoding: 'utf-8' });
        return validateConfiguration(configJson.toString('utf-8'));
    } catch (e) {
        writeLogs('logs.txt', generateLogData('Config Read' ,e.message || 'Cannot read configurations') )
        return null;
    }

}
