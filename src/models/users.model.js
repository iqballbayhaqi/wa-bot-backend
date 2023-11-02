const sql = require('mssql');
const config = require('../../config/db.config');
const role = require('../helpers/role');

const pool = new sql.ConnectionPool(config);

const UserModel = {
    createUser: async (userData) => {
        try {
            await pool.connect();
            const request = pool.request();

            request.input('nik', sql.VarChar, userData.nik);
            request.input('name', sql.VarChar, userData.name);
            request.input('hashPassword', sql.VarChar, userData.hashPassword);
            request.input('role', sql.VarChar, role.AGENT)

            const result = await request.query(`
                INSERT INTO [User] (nik, name, hashPassword, departmentCode, role)
                VALUES (@nik, @name, @hashPassword, @role);
                SELECT SCOPE_IDENTITY() AS newUserId;
            `);
            return result.recordset[0].newUserId;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            pool.close();
        }
    },

    findUserByNik: async (nik) => {
        try {
            await pool.connect();
            const request = pool.request();

            request.input('nik', sql.VarChar, nik);

            const result = await request.query(`
                SELECT * FROM [User] WHERE nik = @nik
            `);

            return result.recordset[0];
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            pool.close();
        }
    },

    getUserPassword: async (nik) => {
        try {
            await pool.connect();
            const request = pool.request();

            request.input('nik', sql.VarChar, nik);

            const result = await request.query(`
                SELECT hashPassword FROM Users WHERE nik = @nik
            `);

            return result.recordset[0].hashPassword;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            pool.close();
        }
    }
}

module.exports = UserModel