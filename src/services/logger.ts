const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'application.log');

function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${message}\n`;

    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Failed to write to log file', err);
        }
    });
}

export default log;