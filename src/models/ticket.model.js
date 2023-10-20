const sql = require('mssql');
const config = require('../../config/db.config')
const TICKET_STATUS = require('../helpers/ticketStatus');

const TicketModel = {
    getAllTickets: async () => {
        try {
            await sql.connect(config);

            const result = await sql.query(`
                SELECT * FROM Ticket
                WHERE modifyStatus != 'D'
            `);

            return result.recordset.map((ticket) => {
                return {
                    id: ticket.id,
                    ticketNumber: ticket.ticketNumber,
                    status: ticket.status,
                    phoneNumber: ticket.phoneNumber,
                    startTime: ticket.startTime,
                    endTime: ticket.endTime,
                    issue: ticket.issue,
                    issuerName: ticket.issuerName,
                    issuerAfdeling: ticket.issuerAfdeling,
                    issuerUnit: ticket.issuerUnit,
                    department: ticket.department,
                    category: ticket.category,
                    chatState: ticket.chatState,
                    chatHistory: ticket.chatHistory,
                    createdTime: ticket.createdTime,
                    modifyStatus: ticket.modifyStatus,
                    lastModifiedTime: ticket.lastModifiedTime,
                    lastModifiedBy: ticket.lastModifiedBy
                }
            });
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            sql.close();
        }
    },

    createTicket: async (ticketData) => {
        try {
            await sql.connect(config);

            const request = new sql.Request();

            request.input('ticketNumber', sql.VarChar, ticketData.ticketNumber);
            request.input('phoneNumber', sql.VarChar, ticketData.phoneNumber);
            request.input('chatState', sql.Int, 1);
            request.input('chatHistory', sql.VarChar, ticketData.chatHistory);
            request.input('status', sql.VarChar, TICKET_STATUS.OPEN);

            const result = await request.query(`
                INSERT INTO Ticket (ticketNumber, phoneNumber, chatState, chatHistory, status)
                VALUES (@ticketNumber, @phoneNumber, @chatState, @chatHistory, @status);
                SELECT SCOPE_IDENTITY() AS newTicketId;
            `);

            return result.recordset[0].newTicketId;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            sql.close();
        }
    },

    updateTicket: async (ticketData) => {
        try {
            await sql.connect(config);

            const request = new sql.Request();

            request.input('chatState', sql.Int, ticketData.chatState);
            request.input('chatHistory', sql.NVarChar, ticketData.chatHistory);
            request.input('status', sql.VarChar, ticketData.status);
            request.input('issue', sql.VarChar, ticketData.issue);
            request.input('issuerName', sql.VarChar, ticketData.issuerName);
            request.input('issuerAfdeling', sql.VarChar, ticketData.issuerAfdeling);
            request.input('issuerUnit', sql.VarChar, ticketData.issuerUnit);
            request.input('department', sql.VarChar, ticketData.department);
            request.input('category', sql.VarChar, ticketData.category);
            request.input('endTime', sql.VarChar, ticketData.endTime);
            request.input('modifyStatus', sql.VarChar, 'U')

            const result = await request.query(`
                UPDATE Ticket
                SET chatState = @chatState,
                    chatHistory = @chatHistory,
                    status = @status,
                    issue = @issue,
                    issuerName = @issuerName,
                    issuerAfdeling = @issuerAfdeling,
                    issuerUnit = @issuerUnit,
                    department = @department,
                    category = @category,
                    endTime = @endTime,
                    modifyStatus = @modifyStatus
                WHERE id = @id
            `);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            sql.close();
        }
    },

    getTicketById: async (ticketId) => {
        try {
            await sql.connect(config);

            const request = new sql.Request();

            request.input('id', sql.Int, ticketId);

            const result = await request.query(`
                SELECT * FROM Ticket
                WHERE id = @id
            `);

            return result.recordset[0];
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            sql.close();
        }
    },

    getActiveTicketByPhoneNumber: async (phoneNumber) => {
        try {
            await sql.connect(config);

            const request = new sql.Request();

            request.input('phoneNumber', sql.VarChar, phoneNumber);

            const result = await request.query(`
                SELECT * FROM Ticket
                WHERE phoneNumber = @phoneNumber
                AND status != 'CLOSED'
            `);

            return result.recordset[0];
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            sql.close();
        }
    },

    getTicketChatHistory: async (ticketId) => {
        try {
            await sql.connect(config);

            const request = new sql.Request();

            request.input('id', sql.Int, ticketId);

            const result = await request.query(`
                SELECT chatHistory FROM Ticket
                WHERE id = @id
            `);

            return result.recordset[0].chatHistory;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            sql.close();
        }
    },

    updateTicketChatHistory: async (ticketId, chatHistory) => {
        try {
            await sql.connect(config);

            const request = new sql.Request();

            request.input('id', sql.Int, ticketId);
            request.input('chatHistory', sql.NVarChar, chatHistory);

            const result = await request.query(`
                UPDATE Ticket
                SET chatHistory = @chatHistory
                WHERE id = @id
            `);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            sql.close();
        }
    }

};

module.exports = TicketModel;
