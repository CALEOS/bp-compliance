const CheckResult = require('./CheckResult');
const Logger = require('../Logger');
const HttpChecker = require('../HttpChecker');

class AComplianceCheck {

    constructor (bp) {
        this.bp = bp;
        this.results = [];
        this.logger = new Logger();
        this.httpChecker = new HttpChecker();
    }

    getResults () {
        return this.results;
    }

    addSuccess (message) {
        this.results.push(new CheckResult('success', message));
    }

    addWarning (message) {
        this.results.push(new CheckResult('warning', message));
    }

    addError (message) {
        this.results.push(new CheckResult('error', message));
    }

    toString () {
        this.results.forEach((checkResult) => {
            this.log(checkResult.toString());
        });
    }

    log (message) {
        this.logger.log(message);
    }

}

module.exports = AComplianceCheck;