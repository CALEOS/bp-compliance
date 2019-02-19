class Logger {
    log(message) {
        console.log(`${new Date().toISOString().slice(0, 19).replace('T', ' ')} ${message}`);
    }
}

module.exports = Logger;