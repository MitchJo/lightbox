const fs = require('fs');
const path = require('path');
const { fileConstants } = require('../constants');

function validateConfiguration(config) {
    if (!config) return;
    let configJson = {};

    try {
        configJson = JSON.parse(config);
    } catch (e) {
        return null;
    }

    if (!configJson?.host && !configJson.host.length) return;
    if (!configJson?.protocol && !configJson.protocol.length) return;
    if (!configJson?.port && !configJson.port.length) return;

    if (!configJson?.privateKey && !configJson.privateKey.length) return;
    if (!configJson?.rootCa && !configJson.rootCa.length) return;
    if (!configJson?.deviceCert && !configJson.deviceCert.length) return;


    if (!fs.existsSync(configJson.privateKey)) return;
    if (!fs.existsSync(configJson.rootCa)) return;
    if (!fs.existsSync(configJson.deviceCert)) return;

    configJson.port = parseInt(configJson.port)

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

    if (!fs.existsSync(privateKeyPath)) throw new Error('Private key is required!!!')
    if (!fs.existsSync(rootCaPath)) throw new Error('Root Certificate Authority is required!!!')
    if (!fs.existsSync(deviceCertPath)) throw new Error('Device certificate is required!!!')
                
    const jsonContent = JSON.stringify({ ...others, rootCa: rootCaPath, privateKey: privateKeyPath, deviceCert: deviceCertPath })
    fs.writeFileSync(`${directoryPath}/config.json`, jsonContent);

    return jsonContent;

}

exports.getConfigurations = async (appDir) => {
    const directoryPath = path.join(appDir, 'configurationFiles');

    try {
        const configJson = fs.readFileSync(`${directoryPath}/config.json`, { encoding: 'utf-8' });
        return validateConfiguration(configJson.toString('utf-8'));
    } catch (e) {
        return null;
    }

}
