const AComplianceCheck = require('./AComplianceCheck');

class JsonExists extends AComplianceCheck {

    async check () {
        return this.checkUrl(this.bp.getUrl()+'/bp.json');
    }

    async checkUrl (url) {
        this.log(`Checking ${url}`);
        let result = await this.httpChecker.httpGet(url);
        this.log(`Checking ${url} complete`);
        if (result.response && result.response.statusCode === 200)
            this.addSuccess(`${url} returned a 200 response`);
        else
            this.addError(`Failed to get a 200 response from ${url}, got ${result.response && result.response.statusCode ? result.response.statusCode : "no response"} and error ${result.error}`)
    }

}

module.exports = JsonExists;
