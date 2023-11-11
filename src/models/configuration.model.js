const sql = require('mssql');
const config = require('../../config/db.config');

const pool = new sql.ConnectionPool(config);
pool.connect();

const ConfigurationModel = {
    getBroadcastConfig: async () => {
        try {
            const request = pool.request();

            // select from configuration table where column named key is 'broadcast_quota' and 'max_broadcasts_quota and 'sent_messages'
            const result = await request.query(`
            SELECT [key], [value]
            FROM Configuration 
            WHERE
            [key] = 'broadcast_quota' OR
            [key] = 'max_broadcast_quota' OR
            [key] = 'sent_broadcast_message'
            `);

            return result.recordset;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    updateBroadcastConfig: async (newQuota, sentMsg) => {
        try {
            const request = pool.request();

            const result = await request.query(`
            UPDATE Configuration
            SET [value] = ${newQuota}
            WHERE [key] = 'broadcast_quota';

            UPDATE Configuration
            SET [value] = ${sentMsg}
            WHERE [key] = 'sent_broadcast_message';
            `);

            return result.recordset;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }


}

module.exports = ConfigurationModel;

