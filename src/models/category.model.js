const sql = require('mssql');
const config = require('../../config/db.config')

const pool = new sql.ConnectionPool(config);
pool.connect();

const CategoryModel = {
    getAllCategory: async () => {
        try {
            const request = pool.request();

            const result = await request.query(`
                SELECT * FROM Category
                WHERE modifyStatus != 'D'
            `);

            return result.recordset.map((category) => {
                return {
                    id: category.id,
                    name: category.name,
                    departmentCode: category.departmentCode,
                    modifyStatus: category.modifyStatus,
                    createdBy: category.createdBy,
                    createdTime: category.createdTime,
                    lastModifiedBy: category.lastModifiedBy,
                    lastModifiedTime: category.lastModifiedTime
                }
            });
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    addCategory: async (categoryData) => {
        try {
            const request = pool.request();

            request.input('name', sql.VarChar, categoryData.name);
            request.input('departmentCode', sql.VarChar, categoryData.departmentCode);
            request.input('createdBy', sql.Int, categoryData.createdBy);

            const result = await request.query(`
                INSERT INTO Category (name, departmentCode, createdBy)
                VALUES (@name, @departmentCode, @createdBy);
                SELECT SCOPE_IDENTITY() AS newCategoryId;
            `);

            return result.recordset[0].newCategoryId;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    updateCategory: async (categoryData) => {
        try {
            const request = pool.request();

            // Bind parameters to the request object
            request.input('name', sql.VarChar, categoryData.name);
            request.input('departmentCode', sql.VarChar, categoryData.departmentCode);
            request.input('id', sql.Int, categoryData.id);
            request.input('lastModifiedBy', sql.Int, categoryData.lastModifiedBy)

            const result = await request.query(`
                UPDATE Category
                SET name = @name,
                departmentCode = @departmentCode,
                modifyStatus = 'U',
                lastModifiedBy = @lastModifiedBy
                WHERE id = @id
            `);

            return result.rowsAffected[0];
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    deleteCategory: async (categoryData) => {
        try {
            const request = pool.request();

            request.input('id', sql.Int, categoryData.id);
            request.input('modifyStatus', sql.VarChar, 'D');
            request.input('lastModifiedBy', sql.Int, categoryData.lastModifiedBy)

            const result = await request.query(`
                UPDATE Category
                SET modifyStatus = @modifyStatus,
                lastModifiedBy = @lastModifiedBy
                WHERE id = @id
            `);

            return result.rowsAffected[0];
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    getCategoryById: async (categoryId) => {
        try {
            const request = pool.request();

            request.input('id', sql.Int, categoryId);

            const result = await request.query(`
                SELECT * FROM Category
                WHERE id = @id
                AND modifyStatus != 'D'
            `);

            return result.recordset[0];
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

};

module.exports = CategoryModel;
