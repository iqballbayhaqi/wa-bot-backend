const sql = require('mssql');

const config = require('../../config/db.config');

async function runQuery(query, params) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        if (params) {
            for (const [key, value] of Object.entries(params)) {
                request.input(key, value);
            }
        }
        const result = await request.query(query);
        return result.recordset;
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        sql.close();
    }
}

module.exports = {
    runQuery,
};