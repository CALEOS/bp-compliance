let WebsiteCheck = require('./src/checks/WebsiteCheck');

module.exports = {
    filter: [
    //   'infinitybloc'
    ],
    checks: [
        WebsiteCheck
    ],
    mainnet: {
        chainId: '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
        endpoint: 'https://telos.caleos.io'
    },
    testnet: {
        chainId: 'e17615decaecd202a365f4c029f206eee98511979de8a5756317e2469f2289e3',
        endpoint: 'https://testnet.telos.caleos.io'
    }
};