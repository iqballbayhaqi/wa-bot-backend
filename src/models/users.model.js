const sql = require('mssql');
const config = require('../../config/db.config');
const role = require('../helpers/role');

const UserModel = {
    createUser: async (userData) => {
        try {
            await sql.connect(config);

            const request = new sql.Request();

            request.input('nik', sql.VarChar, userData.nik);
            request.input('name', sql.VarChar, userData.name);
            request.input('hashPassword', sql.VarChar, userData.hashPassword);
            request.input('departmentCode', sql.VarChar, userData.departmentCode);
            request.input('role', sql.VarChar, role.AGENT)

            const result = await request.query(`
                INSERT INTO [User] (nik, name, hashPassword, departmentCode, role)
                VALUES (@nik, @name, @hashPassword, @departmentCode, @role);
                SELECT SCOPE_IDENTITY() AS newUserId;
            `);
            return result.recordset[0].newUserId;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            sql.close();
        }
    },

    findUserByNik: async (nik) => {
        try {
            await sql.connect(config);

            const request = new sql.Request();

            request.input('nik', sql.VarChar, nik);

            const result = await request.query(`
                SELECT * FROM [User] WHERE nik = @nik
            `);

            return result.recordset[0];
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            sql.close();
        }
    },

    getUserPassword: async (nik) => {
        try {
            await sql.connect(config);

            const request = new sql.Request();

            request.input('nik', sql.VarChar, nik);

            const result = await request.query(`
                SELECT hashPassword FROM Users WHERE nik = @nik
            `);

            return result.recordset[0].hashPassword;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            sql.close();
        }
    }
}

module.exports = UserModel