module.exports = {
    user: 'admin',
    password: 'admin123',
    server: 'localhost',
    database: 'customer-service',
    options: {
        port: 1433,
        trustServerCertificate: true,
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
}