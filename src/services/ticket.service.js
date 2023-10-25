const TicketModel = require('../models/ticket.model');


const TicketService = {
    getAllTickets: async () => {
        try {
            const tickets = await TicketModel.getAllTickets();
            return tickets;
        } catch (err) {
            console.error('Error in TicketService.getAllTickets:', err);
            throw err;
        }
    },

    getTicketById: async (ticketId) => {
        try {
            const ticket = await TicketModel.getTicketById(ticketId);
            return ticket;
        } catch (err) {
            console.error('Error in TicketService.getTicketById:', err);
            throw err;
        }
    },

    createTicket: async (ticketData) => {
        try {
            const result = await TicketModel.createTicket(ticketData);
            return result;
        } catch (err) {
            console.error('Error in TicketService.createTicket:', err);
            throw err;
        }
    },

    updateTicket: async (ticketData) => {
        try {
            const result = await TicketModel.updateTicket(ticketData);
            return result;
        } catch (err) {
            console.error('Error in TicketService.updateTicket:', err);
            throw err;
        }
    },

    getActiveTicketByPhoneNumber: async (phoneNumber) => {
        try {
            const ticket = await TicketModel.getActiveTicketByPhoneNumber(phoneNumber);
            return ticket;
        } catch (err) {
            console.error('Error in TicketService.getActiveTicketByPhoneNumber:', err);
            throw err;
        }
    },

    updateTicketChatHistory: async (ticketId, chatHistory) => {

        try {
            let prevChatHistory = await TicketModel.getTicketChatHistory(ticketId);

            if (prevChatHistory === null) {
                prevChatHistory = "[]";
            }

            const jsonChat = JSON.parse(prevChatHistory);

            const index = jsonChat.findIndex(chat => chat.id === chatHistory.id);
            if (index !== -1) {
                if (chatHistory.status === "delivered") {
                    chatHistory.deliveredTime = chatHistory.time;
                    delete chatHistory.time;
                }
                if (chatHistory.status === "read") {
                    chatHistory.readTime = chatHistory.time;
                    delete chatHistory.time;
                }

                jsonChat[index] = chatHistory;
            } else {
                jsonChat.push(chatHistory);
            }

            const newChatHistory = JSON.stringify(jsonChat);

            await TicketModel.updateTicketChatHistory(ticketId, newChatHistory);
        } catch (err) {
            console.error('Error in TicketService.updateTicketChatHistory:', err);
            throw err;
        }
    },

    updateTicketChatState: async (ticketId, chatState) => {
        try {
            await TicketModel.updateTicketChatState(ticketId, chatState);
        } catch (err) {
            console.error('Error in TicketService.updateTicketChatState:', err);
            throw err;
        }
    },

    updateTicketIdentity: async (ticketId, identity) => {
        try {
            await TicketModel.updateTicketIdentity(ticketId, identity);
        } catch (err) {
            console.error('Error in TicketService.updateTicketIdentity:', err);
            throw err;
        }
    },

    moveTicket: async (ticketId, departmentId, categoryId, lastModifiedBy) => {
        try {
            await TicketModel.moveTicket(ticketId, departmentId, categoryId, lastModifiedBy);
        } catch (err) {
            console.error('Error in TicketService.moveTicket:', err);
            throw err;
        }
    },

    updateTicketStatus: async (ticketId, status) => {
        try {
            await TicketModel.updateTicketStatus(ticketId, status);
        } catch (err) {
            console.error('Error in TicketService.updateTicketStatus:', err);
            throw err;
        }
    },

    updateTicketExpiration: async (ticketId, expiryTime, hasExtended) => {
        try {
            await TicketModel.updateTicketExpiration(ticketId, expiryTime, hasExtended);
        } catch (err) {
            console.error('Error in TicketService.updateTicketExpiration:', err);
            throw err;
        }
    },

    getExpiredTickets: async () => {
        try {
            const tickets = await TicketModel.getExpiredTickets();
            return tickets;
        } catch (err) {
            console.error('Error in TicketService.getExpiredTickets:', err);
            throw err;
        }
    },

    extendExpiredTicket: async (ticketId, expiryTime) => {
        try {
            await TicketModel.extendExpiredTicket(ticketId, expiryTime);
        } catch (err) {
            console.error('Error in TicketService.extendExpiredTicket:', err);
            throw err;
        }
    },

    generateTicketNumber: async () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const numberOfTickets = await TicketModel.getNumberOfTicketsByDate(date);
        const numberOfTicketsFixed = (numberOfTickets + 1).toString().padStart(5, '6');
        return `#${year}${month}${day}-${numberOfTicketsFixed}`;
    },


};


module.exports = TicketService;