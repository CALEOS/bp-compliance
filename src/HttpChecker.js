const request = require('request');
const Logger = require('./Logger');
const MAX_TIMEOUT = 10000;
process.env.UV_THREADPOOL_SIZE = 128;


class HttpChecker {

    constructor () {
        this.logger = new Logger();
    }

    async httpGet(url) {
        this.logger.log(`Getting url ${url}`);

        return new Promise((resolve, reject) => {
            request({
                url: url, 
                timeout: MAX_TIMEOUT,  
                headers: {
                    'User-Agent': 'request'
                }}, (error, response, body) => {
                    this.logger.log(`Getting url ${url} complete`);
                    if (error) {
                        this.logger.log(`Failed to get ${url}, got ${response && response.statusCode || -1} code and error: ${error}`);
                    }

                    resolve({response, error, body});
                });
        });
    }
}

module.exports = HttpChecker;