const sql = require('mssql');
const config = require('../../config/db.config');

const pool = new sql.ConnectionPool(config);

const QuestionModel = {
    getAllQuestion: async () => {
        try {
            await pool.connect();
            const request = pool.request();

            const result = await request.query(`
                SELECT question, forState FROM Question
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

module.exports = QuestionModel;

