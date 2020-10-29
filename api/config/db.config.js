const config = require('./index')
module.exports = {
    HOST: config.databaseHOST,
    USER: config.databaseUSER,
    PASSWORD: config.databasePASS,
    DB: config.databaseNAME
};