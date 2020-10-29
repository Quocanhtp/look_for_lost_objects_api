const dotenv = require('dotenv');

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
    // This error should crash whole process

    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

module.exports = {

    /**
     * Your favorite host
     */
    port: parseInt(process.env.MYSQL_PORT, 10),

    /**
     * That long string from mlab
     */
    databaseHOST: process.env.MYSQL_HOST,

    /**
     * That long string from mlab
     */
    databaseUSER: process.env.MYSQL_USER,

    /**
     * That long string from mlab
     */
    databaseNAME: process.env.MYSQL_DB,

    /**
     * That long string from mlab
     */
    databasePASS: process.env.MYSQL_PASS,
    /**
     * 
     * That long string from mlab
     */
    databaseLIMIT: process.env.MYSQL_CONNECTION_LIMIT,

    /**
     * Your secret sauce
     */
    jwtSecret: process.env.JWT_SECRET,
    tokenLift: 86400 * 15,
    
    /**
     * Your jwtSecretRefreshToken sauce
     */
    jwtSecretRefreshToken: process.env.JWT_SECRET_REFRESH_TOKEN,
    refreshTokenLift: 86400 * 30,

    /**
     * API configs
     */
    api: {
        prefix: '/api',
    },
};
