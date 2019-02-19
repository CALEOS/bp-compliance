const Logger = require('./Logger');

class BlockProducer {

/*
{ owner: 'telgoingos13',
  total_votes: '3424834008.00549793243408203',
  producer_key: 'EOS1111111111111111111111111111111114T1Anm',
  is_active: 0,
  unreg_reason: '',
  url: 'http://www.goingos.org',
  unpaid_blocks: 0,
  lifetime_produced_blocks: 0,
  missed_blocks_per_rotation: 0,
  lifetime_missed_blocks: 0,
  last_claim_time: '2018-12-20T19:45:15.000',
  location: 0,
  kick_reason_id: 0,
  kick_reason: '',
  times_kicked: 0,
  kick_penalty_hours: 0,
  last_time_kicked: '2000-01-01T00:00:00.000' }
*/

    constructor (prod) {
        this.logger = new Logger();
        this.prod = prod;
        this.checks = [];
    }

    addCheck (check) {
        this.checks.push(check);
    }

    async validate () {
        let checkPromises = [];

        this.checks.forEach((check) => {
            checkPromises.push(check.check());
        });

        await Promise.all(checkPromises);
    }

    hasFailures () {
        return this.getFailures().length > 0;
    }

    getFailures () {
        let failures = [];

        this.checks.forEach((check) => {
            if (check.hasError()) {
                check.getErrors().forEach((error) => {
                    failures.push(error);
                });
            }
        });

        return failures;
    }

    getOwner () {
        return this.prod.owner;
    }

    getUrl () {
        return this.prod.url;
    }

    isActive () {
        return this.prod.is_active === 1;
    }

    log(message) {
        this.logger.log(`${new Date().toISOString().slice(0, 19).replace('T', ' ')} ${message}`);
    }

}

module.exports = BlockProducer;