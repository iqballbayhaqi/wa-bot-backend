const sql = require('mssql');
const config = require('../../config/db.config');
const { getCurrentDateTime } = require('../helpers/time');

const ContactModel = {
    createContact: async (contactData) => {
        try {
            await sql.connect(config);

            const request = new sql.Request();

            request.input('phoneNumber', sql.VarChar, contactData.phoneNumber);

            const result = await request.query(`
                INSERT INTO Contact (phoneNumber)
                VALUES (@phoneNumber);
                SELECT SCOPE_IDENTITY() AS newContactId;
            `);
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            sql.close();
        }
    },

    findContactByPhoneNumber: async (phoneNumber) => {
        try {
            await sql.connect(config);

            const request = new sql.Request();

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
            sql.close();
        }
    },

    getContactChatHistory: async (phoneNumber) => {
        try {
            await sql.connect(config);

            const request = new sql.Request();

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
            sql.close();
        }
    },

    updateContactChatHistory: async (phoneNumber, chatHistory) => {
        try {
            await sql.connect(config);

            const request = new sql.Request();

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
            sql.close();
        }
    },

    updateContactHasActiveTicket: async (phoneNumber, hasActiveTicket) => {
        try {
            await sql.connect(config);

            const request = new sql.Request();

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
            sql.close();
        }
    }

}

module.exports = ContactModel;

