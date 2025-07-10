const fs = require('fs');
const path = require('path');
const { getDateTime } = require('../utils/datentime');
let appDir = '';

exports.writeLogs = (fileName, contents) => {
    if (!fileName.length) return;
    const directoryPath = path.join(appDir, 'app_logs');

    if(!fs.existsSync(directoryPath)) fs.mkdirSync(directoryPath, { recursive: true });

    const filepath = path.join(directoryPath, fileName);

    try {
        fs.appendFileSync(filepath, contents);
    } catch (e) {
        console.log(e)
    }
}

exports.readLogs = (appDir, fileName) => {
    if (!fileName.length) return;

    const directoryPath = path.join(appDir, 'app_logs');
    const filepath = path.join(directoryPath, fileName);

    try {
        const fileContents = fs.readFileSync(filepath)
        return fileContents;
    } catch (e) {
        return '';
    }

}

exports.setLogDir = (directoryPath) => {
    appDir = directoryPath
}

exports.generateLogData = (tag = "GENERIC LOG", message = "") => {
    const time = getDateTime();
    return `${time}\t ${tag}: ${message}\n`;
}