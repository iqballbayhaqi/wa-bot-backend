require('dotenv').config();

module.exports = {
    user: process.env.PUBLIC_DB_USER,
    password: process.env.PUBLIC_DB_PASSWORD,
    server: process.env.PUBLIC_DB_HOST,
    database: process.env.PUBLIC_DB_NAME,
    options: {
        port: Number(process.env.PUBLIC_DB_PORT),
        trustServerCertificate: true,
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
}