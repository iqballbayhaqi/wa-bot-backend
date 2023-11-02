const sql = require('mssql');
const config = require('../../config/db.config');
const { getCurrentDateTime } = require('../helpers/time');

const pool = new sql.ConnectionPool(config);

const ContactModel = {
    createContact: async (contactData) => {
        try {
            await pool.connect();
            const request = pool.request();

            request.input('phoneNumber', sql.VarChar, contactData.phoneNumber);
            request.input('hasActiveTicket', sql.Bit, false);

            const result = await request.query(`
                INSERT INTO Contact (phoneNumber)
                VALUES (@phoneNumber);
                SELECT SCOPE_IDENTITY() AS newContactId;
            `);
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            pool.close();
        }
    },

    getAllEmployeeContact: async () => {
        try {
            await pool.connect();
            const request = pool.request();

            const result = await request.query(`
                SELECT phoneNumber FROM Contact
                WHERE isEmployee = 1 AND modifyStatus != 'D'
            `);

            return result.recordset;
        } catch (err) {
        }
    },

    findContactByPhoneNumber: async (phoneNumber) => {
        try {
            await pool.connect();
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
        } finally {
            pool.close();
        }
    },

    getContactChatHistory: async (phoneNumber) => {
        try {
            await pool.connect();
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
        } finally {
            pool.close();
        }
    },

    updateContactChatHistory: async (phoneNumber, chatHistory) => {
        try {
            await pool.connect();
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
        } finally {
            pool.close();
        }
    },

    updateContactHasActiveTicket: async (phoneNumber, hasActiveTicket) => {
        try {
            await pool.connect();
            const request = pool.request();

            request.input('phoneNumber', sql.VarChar, phoneNumber);
            request.input('hasActiveTicket', sql.Bit, hasActiveTicket);

            const result = await request.query(`
                UPDATE Contact
                SET hasActiveTicket = @hasActiveTicket
                WHERE phoneNumber = @phoneNumber
            `);
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            pool.close();
        }
    },

    updateContactEmploymentStatus: async (phoneNumber, isEmployee) => {
        try {
            await pool.connect();
            const request = pool.request();

            request.input('phoneNumber', sql.VarChar, phoneNumber);
            request.input('isEmployee', sql.Bit, isEmployee);

            const result = await request.query(`
                UPDATE Contact
                SET isEmployee = @isEmployee
                WHERE phoneNumber = @phoneNumber
            `);
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            pool.close();
        }
    }

}

module.exports = ContactModel;

