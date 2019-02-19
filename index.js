const Checker = require('./src/Checker.js');
const conf = require('./config.js');
new Checker(conf).logValidationResults();