const sql = require('mssql');
const config = require('../../config/db.config');

const pool = new sql.ConnectionPool(config);

const BroadcastModel = {
    createBroadcast: async (message, numberList) => {
        try {
            await pool.connect();
            const request = pool.request();

            request.input('message', sql.VarChar, message);
            request.input('numberList', sql.NVarChar, numberList);

            const result = await request.query(`
                INSERT INTO Broadcast (message, numberList, isComplete)
                VALUES (@message, @numberList, 0)
            `);

            return result.recordset;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            pool.close();
        }
    },

    getUncompletedBroadcast: async () => {
        try {
            await pool.connect();
            const request = pool.request();

            // This should apply FIFO
            const result = await request.query(`
                SELECT TOP 1 * FROM Broadcast WHERE isComplete = 0
            `);

            return result.recordset;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            pool.close();
        }
    },

    updateBroadcast: async (id, numberList, isComplete) => {
        try {
            await pool.connect();
            const request = pool.request();

            request.input('id', sql.Int, id);
            request.input('numberList', sql.NVarChar, numberList);
            request.input('isComplete', sql.Bit, isComplete);

            const result = await request.query(`
                UPDATE Broadcast
                SET numberList = @numberList, isComplete = @isComplete
                WHERE id = @id
            `);

            return result.recordset;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            pool.close();
        }
    }
}

module.exports = BroadcastModel;

