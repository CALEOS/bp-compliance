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

            if (!this.config.initCheck)
                throw new Error("Config does not have an initCheck defined");

            bp.setInitCheck(new this.config.initCheck(bp));

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
    }

    async logValidationResults(errorsOnly=false) {
        await this.getValidationResults();
        let _this = this;
        Object.keys(this.prods).forEach((bpName) => {
            let prod = _this.prods[bpName];

            _this.log(`======${bpName}======`);

            prod.getChecks().forEach((check) => {
                check.getResults().forEach((checkResult) => {
                    if (checkResult.hasError() || !errorsOnly)
                        _this.log(checkResult.toString());
                });
            });
            this.log(`bp.json: ${JSON.stringify(prod.getBpJson(), null, 4)}`)

            _this.log(`========================`);
        });
    }

    log(message) {
        console.log(`${new Date().toISOString().slice(0, 19).replace('T', ' ')} ${message}`);
    }
}

module.exports = Checker;