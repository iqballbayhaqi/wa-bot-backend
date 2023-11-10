const sql = require('mssql');
const config = require('../../config/db.config');

const pool = new sql.ConnectionPool(config);
pool.connect();

const BroadcastModel = {
    createBroadcast: async (title, message, numberList) => {
        try {
            const request = pool.request();

            request.input('title', sql.VarChar, title)
            request.input('message', sql.VarChar, message);
            request.input('numberList', sql.NVarChar, numberList);

            const result = await request.query(`
                INSERT INTO Broadcast (title, message, numberList, isComplete)
                VALUES (@title, @message, @numberList, 0)
            `);

            return result.recordset;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    getUncompletedBroadcast: async () => {
        try {
            const request = pool.request();

            const result = await request.query(`
                SELECT TOP 1 * FROM Broadcast WHERE isComplete = 0
            `);

            return result.recordset;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    updateBroadcast: async (id, numberList, isComplete) => {
        try {
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
        }
    },

    getAllBroadcast: async () => {
        try {
            const request = pool.request();

            const result = await request.query(`
                SELECT * FROM Broadcast
            `);

            const broadcasts = result.recordset.map(broadcast => {
                return {
                    id: broadcast.id,
                    title: broadcast.title,
                    message: broadcast.message,
                    createdAt: broadcast.createdTime,
                    totalMessage: JSON.parse(broadcast.numberList).length,
                }
            });

            return broadcasts;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    getBroadcastDetail: async (id) => {
        try {
            const request = pool.request();

            request.input('id', sql.Int, id);

            const result = await request.query(`
                SELECT * FROM Broadcast WHERE id = @id
            `);

            const broadcast = result.recordset.map(broadcast => {
                return {
                    id: broadcast.id,
                    title: broadcast.title,
                    message: broadcast.message,
                    createdAt: broadcast.createdTime,
                    totalMessage: JSON.parse(broadcast.numberList).length,
                    isComplete: broadcast.isComplete,
                }
            });

            return broadcast[0];
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

module.exports = BroadcastModel;

