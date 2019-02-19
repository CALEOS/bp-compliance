const {JsonRpc} = require('eosjs');
const fetch = require('node-fetch');
const BlockProducer = require('./BlockProducer');

class Checker {
    constructor(config) {
        this.config = config;
        this.JsonRpc = new JsonRpc(config.mainnet.endpoint, {fetch});
        this.filter = this.config.filter ? this.config.filter : [];
    }

    async loadMainnet() {
        let getProds = await this.JsonRpc.get_producers(true, "", 10000);
        this.prods = {};
        let _this = this;
        getProds.rows.forEach((prod) => {
            let bp = new BlockProducer(prod);

            if (!bp.isActive() || (_this.config.filter.length && !_this.config.filter.includes(bp.getOwner())))
                return;

            this.config.checks.forEach((check) => {
                bp.addCheck(new check(bp));
            });

            _this.prods[bp.getOwner()] = bp;
        });
    }

    async getValidationResults() {
        await this.loadMainnet();
        let validations = [];
        for (let bpName in this.prods)
            validations.push(this.prods[bpName].validate());

        this.log("Waiting on validations...");
        
        await Promise.all(validations);

        this.log("Validations complete");

        let _this = this;
        Object.keys(this.prods).forEach((bpName) => {
            let prod = _this.prods[bpName];

            prod.checks.forEach((check) => {
                let errorMessages = [];
                check.getResults().forEach((checkResult) => {
                    if (checkResult.hasError())
                        errorMessages.push(checkResult.getMessage());
                });

                if (errorMessages.length)
                    _this.log(`${bpName} has failures ${errorMessages.join(', ')}`);
            });
        });
    }

    async logValidationResults() {
        let validationResults = await this.getValidationResults();
    }

    log(message) {
        console.log(`${new Date().toISOString().slice(0, 19).replace('T', ' ')} ${message}`);
    }
}

module.exports = Checker;