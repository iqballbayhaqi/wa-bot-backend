const sql = require('mssql');
const config = require('../../config/db.config');

const pool = new sql.ConnectionPool(config);
pool.connect();

const QuestionModel = {
    getAllQuestion: async () => {
        try {
            const request = pool.request();

            const result = await request.query(`
                SELECT id, question, forState FROM Question
            `);

            return result.recordset;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

}

module.exports = QuestionModel;

