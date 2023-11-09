const sql = require('mssql');
const config = require('../../config/db.config');
const { getCurrentDateTime } = require('../helpers/time');

const pool = new sql.ConnectionPool(config);
pool.connect();

const ContactModel = {
    createContact: async (contactData) => {
        try {
            const request = pool.request();

            request.input('phoneNumber', sql.VarChar, contactData.phoneNumber);
            request.input('hasActiveTicket', sql.Bit, false);

            const result = await request.query(`
                INSERT INTO Contact (phoneNumber)
                VALUES (@phoneNumber);
                SELECT SCOPE_IDENTITY() AS newContactId;
            `);

            return result.recordset[0].newContactId;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    getAllContact: async () => {
        try {
            const request = pool.request();
            const result = await request.query(`
                SELECT id, phoneNumber FROM Contact
                WHERE modifyStatus != 'D'
            `);

            return result.recordset;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    getAllEmployeeContact: async () => {
        try {
            const request = pool.request();

            const result = await request.query(`
                SELECT phoneNumber FROM Contact
                WHERE isEmployee = 1 AND modifyStatus != 'D'
            `);

            return result.recordset;
        } catch (err) {
            console.log(err);
        }
    },

    findContactByPhoneNumber: async (phoneNumber) => {
        try {
            const request = pool.request();

            request.input('phoneNumber', sql.VarChar, phoneNumber);

            const result = await request.query(`
                SELECT * FROM Contact
                WHERE phoneNumber = @phoneNumber
            `);

            return result.recordset[0];
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    getContactChatHistory: async (phoneNumber) => {
        try {
            const request = pool.request();

            request.input('phoneNumber', sql.VarChar, phoneNumber);

            const result = await request.query(`
                SELECT chatHistory FROM Contact
                WHERE phoneNumber = @phoneNumber
            `);

            return result.recordset[0].chatHistory;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    updateContactChatHistory: async (phoneNumber, chatHistory) => {
        try {
            const request = pool.request();

            request.input('phoneNumber', sql.VarChar, phoneNumber);
            request.input('chatHistory', sql.Text, chatHistory);
            request.input('lastModifiedTime', sql.DateTime, getCurrentDateTime());

            const result = await request.query(`
                UPDATE Contact
                SET chatHistory = @chatHistory
                WHERE phoneNumber = @phoneNumber
            `);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    updateContactHasActiveTicket: async (phoneNumber, hasActiveTicket) => {
        try {
            const request = pool.request();

            request.input('phoneNumber', sql.VarChar, phoneNumber);
            request.input('hasActiveTicket', sql.Bit, hasActiveTicket);

            await request.query(`
                UPDATE Contact
                SET hasActiveTicket = @hasActiveTicket
                WHERE phoneNumber = @phoneNumber
            `);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    updateContactEmploymentStatus: async (phoneNumber, isEmployee) => {
        try {
            const request = pool.request();

            request.input('phoneNumber', sql.VarChar, phoneNumber);
            request.input('isEmployee', sql.Bit, isEmployee);

            await request.query(`
                UPDATE Contact
                SET isEmployee = @isEmployee
                WHERE phoneNumber = @phoneNumber
            `);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    updateContactLastTicket: async (phoneNumber, departmentId, categoryId) => {
        try {
            const request = pool.request();

            request.input('phoneNumber', sql.VarChar, phoneNumber);
            request.input('departmentId', sql.Int, departmentId);
            request.input('categoryId', sql.Int, categoryId);

            await request.query(`
                UPDATE Contact
                SET lastDepartmentId = @departmentId,
                lastCategoryId = @categoryId
                WHERE phoneNumber = @phoneNumber
            `);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    getContactWithLastTicketByDepartment: async (departmentId) => {
        try {
            const request = pool.request();

            request.input('departmentId', sql.Int, departmentId);

            const result = await request.query(`
                SELECT phoneNumber FROM Contact
                WHERE lastDepartmentId = @departmentId
                AND modifyStatus != 'D'
            `);

            return result.recordset;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getContactWithLastTicketByCategory: async (categoryId) => {
        try {
            const request = pool.request();

            request.input('categoryId', sql.Int, categoryId);

            const result = await request.query(`
                SELECT phoneNumber FROM Contact
                WHERE lastCategoryId = @categoryId
                AND modifyStatus != 'D'
            `);

            return result.recordset;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }


}

module.exports = ContactModel;

