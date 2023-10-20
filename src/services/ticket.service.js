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
    }


};


module.exports = TicketService;