const sql = require('mssql');
const config = require('../../config/db.config')

const CategoryModel = {
    getAllCategory: async () => {
        try {
            await sql.connect(config);

            const result = await sql.query(`
                SELECT * FROM Category
                WHERE modifyStatus != 'D'
            `);

            return result.recordset;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            sql.close();
        }
    },

    addCategory: async (categoryData) => {
        try {
            await sql.connect(config);

            const request = new sql.Request();

            request.input('name', sql.VarChar, categoryData.name);
            request.input('departmentCode', sql.VarChar, categoryData.departmentCode);

            const result = await request.query(`
                INSERT INTO Category (name, departmentCode)
                VALUES (@name, @departmentCode);
                SELECT SCOPE_IDENTITY() AS newCategoryId;
            `);

            return result.recordset[0].newCategoryId;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            sql.close();
        }
    },

    updateCategory: async (categoryData) => {
        try {
            await sql.connect(config);

            const request = new sql.Request();

            // Bind parameters to the request object
            request.input('name', sql.VarChar, categoryData.name);
            request.input('departmentCode', sql.VarChar, categoryData.departmentCode);
            request.input('id', sql.Int, categoryData.id);

            const result = await request.query(`
                UPDATE Category
                SET name = @name,
                departmentCode = @departmentCode,
                modifyStatus = 'U'
                WHERE id = @id
            `);

            return result.rowsAffected[0];
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            sql.close();
        }
    },

    deleteCategory: async (categoryId) => {
        try {
            await sql.connect(config);

            const request = new sql.Request();

            request.input('id', sql.Int, categoryId);

            const result = await request.query(`
                UPDATE Category
                SET modifyStatus = 'D'
                WHERE id = @id
            `);

            return result.rowsAffected[0];
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            sql.close();
        }
    },

};

module.exports = CategoryModel;
