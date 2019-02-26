const AComplianceCheck = require('./AComplianceCheck');

class InitializationCheck extends AComplianceCheck {

    async check () {
        this.log('Doing initialization check');
        let checks = [
            this.checkUrl(this.bp.getUrl()),
            this.loadBpJson(this.bp.getUrl())
        ];

        await Promise.all(checks);
        this.log('Done doing initialization check');
    }

    async loadBpJson () {
        let bpJsonUrl = `${this.bp.getUrl()}/bp.json`;
        let bpJsonResult = await this.httpChecker.httpGet(bpJsonUrl);
        if (!bpJsonResult.body) {
            this.addFailure(`Unable to get bp.json from ${bpJsonUrl}, received code ${bpJsonResult.statusCode}`);
            return;
        }

        try {
            let bpJsonObj = JSON.parse(bpJsonResult.body);
            if (!bpJsonObj)
                this.addFailure(`Unable to parse bp json response ${bpJsonResult.body}`);

            this.bp.setBpJson(bpJsonObj);
            this.addSuccess(`Found bp.json file`);
        } catch (e) {
            this.addFailure(`Failed trying to parse bp json response ${bpJsonResult.body} got exception ${e.message}`);
        }
        
    }

    async checkUrl (url) {
        let result = await this.httpChecker.httpGet(url);
        if (result.response && result.response.statusCode === 200)
            this.addSuccess(`${url} returned a 200 response`);
        else
            this.addError(`Failed to get a 200 response from ${url}, got ${result.response && result.response.statusCode ? result.response.statusCode : "no response"} and error ${result.error}`)
    }

}

module.exports = InitializationCheck;