const sql = require('mssql');
const config = require('../../config/db.config');

const QuestionModel = {
    getAllQuestion: async () => {
        try {
            await sql.connect(config);

            const request = new sql.Request();

            const result = await request.query(`
                SELECT question, forState FROM Question
            `);

            return result.recordset;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            sql.close();
        }
    }

}

module.exports = QuestionModel;

