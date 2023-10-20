const axios = require('axios');
const ContactService = require('./contact.service');
const TicketService = require('./ticket.service');

const CHANNEL = 'whatsapp';
const MESSAGE_TYPE = 'text';

const MessageService = {
    replyMessage: async (to, msg) => {
        axios.post('https://web.maxchat.id/api/messages/reply', {
            channel: CHANNEL,
            msgType: MESSAGE_TYPE,
            text: msg,
            to: to,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            auth: {
                username: 'ACb0e8b8b5c4b0c9c4b0c9c4b0c9c4b0c9',
                password: 'c7e6f5e5a7c6f5e5a7c6f5e5a7c6f5e5a7'
            }
        })
    },

    selfMessageHandler: async (chatHistory) => {
        const isContactExist = await ContactService.isContactExist(chatHistory.to);

        if (!isContactExist) {
            await ContactService.createContact({
                phoneNumber: chatHistory.to
            });
        }

        await ContactService.updateContactChatHistory(chatHistory.to, chatHistory);
    },

    receiveMessageHandler: async (chatHistory) => {
        //TODO : check if contact exist
        let contact = await ContactService.findContactByPhoneNumber(chatHistory.from);

        //TODO : if not exist, create new contact
        if (contact === null) {
            await ContactService.createContact({
                phoneNumber: chatHistory.from
            });
        } else {
            contact = await ContactService.findContactByPhoneNumber(chatHistory.from);

            if (contact.hasActiveTicket) {
                console.log("old Ticket")
                const ticket = await TicketService.getActiveTicketByPhoneNumber(chatHistory.from);
                await TicketService.updateTicketChatHistory(ticket.id, chatHistory);

                // TODO: reply message to customer based on ticket chatState
            } else {
                console.log("new Ticket")
                await TicketService.createTicket({
                    phoneNumber: chatHistory.from,
                    chatHistory: JSON.stringify([chatHistory]),
                    ticketNumber: (Math.random() * 1000).toPrecision().toString(),
                })

                // update contact hasActiveTicket to true
                await ContactService.updateContactHasActiveTicket(chatHistory.from, true);
            }
        }

        await ContactService.updateContactChatHistory(chatHistory.from, chatHistory);
    }
};

module.exports = MessageService;
