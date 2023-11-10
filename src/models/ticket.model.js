const sql = require('mssql');
const config = require('../../config/db.config')
const TICKET_STATUS = require('../helpers/ticketStatus');
const mapDashboardInfo = require('../helpers/ticketStatusMapper');

const pool = new sql.ConnectionPool(config);
pool.connect();

const TicketModel = {
    getAllTickets: async () => {
        try {
            const request = pool.request();

            const result = await request.query(`
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
                    department: ticket.department,
                    category: ticket.category,
                }
            });
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    createTicket: async (ticketData) => {
        try {
            const request = pool.request();

            request.input('ticketNumber', sql.VarChar, ticketData.ticketNumber);
            request.input('phoneNumber', sql.VarChar, ticketData.phoneNumber);
            request.input('whatsappName', sql.VarChar, ticketData.whatsappName);
            request.input('chatState', sql.Int, 1);
            request.input('chatHistory', sql.VarChar, ticketData.chatHistory);
            request.input('issue', sql.NVarChar, ticketData.issue);
            request.input('status', sql.VarChar, TICKET_STATUS.OPEN);

            const result = await request.query(`
                INSERT INTO Ticket (ticketNumber, whatsappName, phoneNumber, chatState, chatHistory, status, issue)
                VALUES (@ticketNumber, @whatsappName, @phoneNumber, @chatState, @chatHistory, @status, @issue);
                SELECT SCOPE_IDENTITY() AS newTicketId;
            `);

            return result.recordset[0].newTicketId;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    updateTicket: async (ticketData) => {
        try {
            const request = pool.request();

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
        }
    },

    getTicketById: async (ticketId) => {
        try {
            const request = pool.request();

            request.input('id', sql.Int, ticketId);

            const result = await request.query(`
                SELECT id, ticketNumber, whatsappName, phoneNumber, department, category, status, chatHistory
                FROM Ticket WHERE id = @id
            `);

            return result.recordset[0];
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    getActiveTicketByPhoneNumber: async (phoneNumber) => {
        try {
            const request = pool.request();

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
        }
    },

    getTicketChatHistory: async (ticketId) => {
        try {
            const request = pool.request();

            request.input('id', sql.Int, ticketId);

            const result = await request.query(`
                SELECT chatHistory FROM Ticket
                WHERE id = @id
            `);

            return result.recordset[0].chatHistory;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    updateTicketChatHistory: async (ticketId, chatHistory, status) => {
        try {
            const request = pool.request();
            let result;

            if (status === "delivered" || status === "pending") {
                request.input('id', sql.Int, ticketId);
                request.input('chatHistory', sql.NVarChar, chatHistory);

                result = await request.query(`
                UPDATE Ticket
                SET chatHistory = @chatHistory,
                endTime = GETDATE()
                WHERE id = @id
            `);
            } else {
                request.input('id', sql.Int, ticketId);
                request.input('chatHistory', sql.NVarChar, chatHistory);

                result = await request.query(`
                UPDATE Ticket
                SET chatHistory = @chatHistory
                WHERE id = @id
            `);
            }

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    // get number of ticket as of today
    getNumberOfTicketsByDate: async (date) => {
        try {
            const request = pool.request();

            request.input('date', sql.Date, date);

            const result = await request.query(`
                SELECT COUNT(*) AS numberOfTickets FROM Ticket
                WHERE CAST(createdTime AS DATE) = @date
            `);

            return result.recordset[0].numberOfTickets;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    updateTicketChatState: async (ticketId, chatState) => {
        try {
            const request = pool.request();

            request.input('id', sql.Int, ticketId);
            request.input('chatState', sql.Int, chatState);
            request.input('modifyStatus', sql.VarChar, 'U');

            const result = await request.query(`
                UPDATE Ticket
                SET chatState = @chatState,
                    modifyStatus = @modifyStatus
                WHERE id = @id
            `);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    updateTicketIdentity: async (ticketId, identity) => {
        try {
            const request = pool.request();

            request.input('id', sql.Int, ticketId);
            request.input('issuerName', sql.VarChar, identity.name);
            request.input('issuerAfdeling', sql.VarChar, identity.afdeling);
            request.input('issuerUnit', sql.VarChar, identity.unit);
            request.input('modifyStatus', sql.VarChar, 'U');

            const result = await request.query(`
                UPDATE Ticket
                SET issuerName = @issuerName,
                    issuerAfdeling = @issuerAfdeling,
                    issuerUnit = @issuerUnit,
                    modifyStatus = @modifyStatus
                WHERE id = @id
            `);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    moveTicket: async (ticketId, departmentId, categoryId, lastModifiedBy) => {
        try {
            const request = pool.request();

            request.input('id', sql.Int, ticketId);
            request.input('department', sql.Int, departmentId);
            request.input('category', sql.Int, categoryId);
            request.input('modifyStatus', sql.VarChar, 'U');
            request.input('lastModifiedBy', sql.Int, lastModifiedBy);

            const result = await request.query(`
                UPDATE Ticket
                SET department = @department,
                    category = @category,
                    modifyStatus = @modifyStatus
                WHERE id = @id
            `);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    updateTicketStatus: async (ticketId, status) => {
        try {
            const request = pool.request();

            request.input('id', sql.Int, ticketId);
            request.input('status', sql.VarChar, status);
            request.input('modifyStatus', sql.VarChar, 'U');

            const result = await request.query(`
                UPDATE Ticket
                SET status = @status,
                    modifyStatus = @modifyStatus
                WHERE id = @id
            `);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    updateTicketExpiration: async (ticketId, expiryTime, hasExtended) => {
        try {
            const request = pool.request();

            request.input('id', sql.Int, ticketId);
            request.input('expiryTime', sql.DateTime, expiryTime);
            request.input('hasExtended', sql.Bit, hasExtended);
            request.input('modifyStatus', sql.VarChar, 'U');

            const result = await request.query(`
                UPDATE Ticket
                SET expiryTime = @expiryTime,
                    hasExtended = @hasExtended,
                    modifyStatus = @modifyStatus
                WHERE id = @id
            `);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    getExpiredTickets: async () => {
        try {
            const request = pool.request();

            const result = await request.query(`
                SELECT * FROM Ticket
                WHERE expiryTime < GETDATE()
                AND modifyStatus != 'D'
                AND status != 'CLOSED'
            `);

            return result.recordset.map((ticket) => {
                return {
                    id: ticket.id,
                    ticketNumber: ticket.ticketNumber,
                    phoneNumber: ticket.phoneNumber,
                    expiryTime: ticket.expiryTime,
                    hasExtended: ticket.hasExtended,
                    status: ticket.status,
                }
            });
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    extendExpiredTicket: async (ticketId, expiryTime) => {
        try {
            const request = pool.request();

            request.input('id', sql.Int, ticketId);
            request.input('expiryTime', sql.DateTime, expiryTime);
            request.input('hasExtended', sql.Bit, 1);
            request.input('modifyStatus', sql.VarChar, 'U');

            const result = await request.query(`
                UPDATE Ticket
                SET expiryTime = @expiryTime,
                    hasExtended = @hasExtended,
                    modifyStatus = @modifyStatus
                WHERE id = @id
            `);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    getContactWithExpiredTicket: async () => {
        try {
            const request = pool.request();

            const result = await request.query(`
                SELECT phoneNumber FROM Ticket
                WHERE expiryTime < GETDATE()
                AND modifyStatus != 'D'
                AND status != 'CLOSED'
            `);

            return result.recordset.map((ticket) => {
                return {
                    phoneNumber: ticket.phoneNumber
                }
            });
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    getDashboardInformation: async (startDate, endDate) => {
        try {
            const request = pool.request();

            request.input('startDate', sql.Date, startDate);
            request.input('endDate', sql.Date, endDate);

            console.log(startDate, endDate)

            const result = await request.query(`
            SELECT
                department.id AS departmentId,
                department.name AS departmentName,
                COUNT(CASE WHEN status = 'OPEN' AND (ticket.createdTime IS NULL OR (ticket.createdTime >= @startDate AND ticket.createdTime <= @endDate)) THEN 1 END) AS openTickets,
                COUNT(CASE WHEN status = 'PENDING' AND (ticket.createdTime IS NULL OR (ticket.createdTime >= @startDate AND ticket.createdTime <= @endDate)) THEN 1 END) AS pendingTickets,
                COUNT(CASE WHEN status = 'CLOSED' AND (ticket.createdTime IS NULL OR (ticket.createdTime >= @startDate AND ticket.createdTime <= @endDate)) THEN 1 END) AS closedTickets,
                COUNT(CASE WHEN status IN ('OPEN', 'PENDING', 'CLOSED') AND (ticket.createdTime IS NULL OR (ticket.createdTime >= @startDate AND ticket.createdTime <= @endDate)) THEN 1 END) AS totalTickets
            FROM Department department
            LEFT JOIN Ticket ticket ON department.id = ticket.department
            GROUP BY department.id, department.name

            UNION ALL

            SELECT
                NULL AS departmentId,
                'Unassigned' AS departmentName,
                COUNT(CASE WHEN status = 'OPEN' AND (createdTime IS NULL OR (createdTime >= @startDate AND createdTime <= @endDate)) THEN 1 END) AS openTickets,
                COUNT(CASE WHEN status = 'PENDING' AND (createdTime IS NULL OR (createdTime >= @startDate AND createdTime <= @endDate)) THEN 1 END) AS pendingTickets,
                COUNT(CASE WHEN status = 'CLOSED' AND (createdTime IS NULL OR (createdTime >= @startDate AND createdTime <= @endDate)) THEN 1 END) AS closedTickets,
                COUNT(CASE WHEN status IN ('OPEN', 'PENDING', 'CLOSED') AND (createdTime IS NULL OR (createdTime >= @startDate AND createdTime <= @endDate)) THEN 1 END) AS totalTickets
            FROM Ticket
            WHERE department IS NULL;


            `);

            return result.recordsets[0];
        } catch (err) {
            console.error(err);
            throw err;
        }

    },

    getActiveTicketByDepartment: async (departmentId) => {
        try {
            const request = pool.request();

            request.input('departmentId', sql.Int, departmentId);

            const result = await request.query(`
                SELECT * FROM Ticket
                WHERE department = @departmentId
                AND status != 'CLOSED'
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
                    department: ticket.department,
                    category: ticket.category,
                }
            });
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    getAllTicketByDepartment: async (departmentId) => {
        try {
            const request = pool.request();

            request.input('departmentId', sql.Int, departmentId);

            const result = await request.query(`
                SELECT * FROM Ticket
                WHERE department = @departmentId
                AND modifyStatus != 'D'
            `);

            return result.recordset.map((ticket) => {
                return {
                    id: ticket.id,
                    ticketNumber: ticket.ticketNumber,
                    status: ticket.status,
                    phoneNumber: ticket.phoneNumber,
                    department: ticket.department,
                    createdTime: ticket.createdTime,
                }
            });
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    getActiveTicketByCategory: async (categoryId) => {
        try {
            const request = pool.request();

            request.input('categoryId', sql.Int, categoryId);

            const result = await request.query(`
                SELECT * FROM Ticket
                WHERE category = @categoryId
                AND status != 'CLOSED'
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
                    department: ticket.department,
                    category: ticket.category,
                }
            });
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
};

module.exports = TicketModel;
