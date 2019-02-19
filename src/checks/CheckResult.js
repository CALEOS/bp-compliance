class CheckResult {

    constructor (status, message) {
        this.status = status;        
        this.message = message;
    }

    hasError () {
        return this.status === 'error';
    }

    getStatus () {
        return this.status;
    }

    getMessage () {
        return this.message;
    }

}

module.exports = CheckResult;