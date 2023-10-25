const axios = require('axios');
const ContactService = require('./contact.service');
const TicketService = require('./ticket.service');
const QuestionService = require('./question.service');
const TICKET_STATUS = require('../helpers/ticketStatus');

const MESSAGE_TYPE = 'text';

const MessageService = {
    sendMessage: async (to, msg) => {
        axios.post('https://core.maxchat.id/wanasawit-subur-lestari/api/messages', {
            "to": to,
            "type": MESSAGE_TYPE,
            "text": msg,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + process.env.PUBLIC_MAXCHAT_TOKEN
            },
        })
    },

    selfMessageHandler: async (chatHistory) => {
        const isContactExist = await ContactService.isContactExist(chatHistory.to);

        if (!isContactExist) {
            await ContactService.createContact({
                phoneNumber: chatHistory.to
            });
        }

        const contact = await ContactService.findContactByPhoneNumber(chatHistory.to);

        const ticket = await TicketService.getActiveTicketByPhoneNumber(chatHistory.to);

        if (!ticket) {
            return;
        }

        await TicketService.updateTicketChatHistory(ticket.id, chatHistory);

        await MessageService.processOutgoingMessage(contact, chatHistory, ticket);
        await ContactService.updateContactChatHistory(chatHistory.to, chatHistory);
    },

    receiveMessageHandler: async (chatHistory) => {
        //TODO : check if contact exist
        let contact = await ContactService.findContactByPhoneNumber(chatHistory.from);
        let ticket;

        //TODO : if not exist, create new contact
        if (!contact) {
            await ContactService.createContact({
                phoneNumber: chatHistory.from
            });
        }

        contact = await ContactService.findContactByPhoneNumber(chatHistory.from);

        if (contact.hasActiveTicket) {
            ticket = await TicketService.getActiveTicketByPhoneNumber(chatHistory.from);
            await TicketService.updateTicketChatHistory(ticket.id, chatHistory);
        } else {
            const ticketNumber = await TicketService.generateTicketNumber();

            await TicketService.createTicket({
                phoneNumber: chatHistory.from,
                chatHistory: JSON.stringify([chatHistory]),
                ticketNumber: ticketNumber,
                issue: chatHistory.text
            })
            // update contact hasActiveTicket to true
            await ContactService.updateContactHasActiveTicket(chatHistory.from, true);

            ticket = await TicketService.getActiveTicketByPhoneNumber(chatHistory.from);
            await TicketService.updateTicketChatHistory(ticket.id, chatHistory);
        }


        await MessageService.processIncomingMessage(contact, chatHistory, ticket);
        await ContactService.updateContactChatHistory(chatHistory.from, chatHistory);

    },

    processIncomingMessage: async (contact, chatHistory, ticket) => {
        console.log(chatHistory)
        switch (ticket.chatState) {
            case 1:
                await MessageService.sendMessage(chatHistory.from, 'Apakah anda karyawan Best Agro International? [Ya/Tidak]');
                await TicketService.updateTicketChatState(ticket.id, 2);
                break;
            case 2:
                if (chatHistory.text.toLowerCase() === 'ya') {
                    await MessageService.sendMessage(chatHistory.from, 'Silahkan info data anda: Nama/Afdeling/Unit Usaha (PT)');
                    await TicketService.updateTicketChatState(ticket.id, 3);
                } else {
                    await MessageService.sendMessage(chatHistory.from, 'Apakah anda karyawan Best Agro International? [Ya/Tidak]');
                }
                break;
            case 3:
                const pattern = /^[a-zA-Z0-9\s]+\/[a-zA-Z0-9\s]+\/[a-zA-Z0-9\s]+$/;
                if (pattern.test(chatHistory.text)) {
                    // await MessageService.sendMessage(chatHistory.from, 'Terima kasih, data anda telah kami terima');
                    const [name, afdeling, unit] = chatHistory.text.split('/').map(item => item.trim());
                    await TicketService.updateTicketIdentity(ticket.id, { name, afdeling, unit });
                    await TicketService.updateTicketChatState(ticket.id, 4);
                } else {
                    await MessageService.sendMessage(chatHistory.from, 'Format data yang anda masukkan salah. Silahkan masukkan data dengan format: Nama/Afdeling/Unit Usaha (PT)');
                }
                break;

            case 6:
                if (chatHistory.text) {
                    if (chatHistory.text.toLowerCase() === "sudah") {
                        await MessageService.sendMessage(chatHistory.from, 'Terimakasih atas tanggapan anda. Mohon memberikan nilai kepuasan anda terhadap pelayanan kami');
                        await TicketService.updateTicketStatus(ticket.id, TICKET_STATUS.CLOSED);
                    }
                    else if (chatHistory.text.toLowerCase() === "belum") {
                        await MessageService.sendMessage(chatHistory.from, 'Silahkan tunggu konfirmasi dari kami');
                        await TicketService.updateTicketChatState(ticket.id, 7);
                    }
                    else {
                        await MessageService.sendMessage(chatHistory.from, 'Tolong masukkan informasi dengan benar');
                    }
                }
                break;

            default:
                break;

        }
    },

    processOutgoingMessage: async (contact, chatHistory, ticket) => {
        console.log(chatHistory)
        // Make sure this doesnt include responsing from broadcast

        switch (ticket.chatState) {
            case 4:
                const faqList = await QuestionService.getAllQuestion();

                if (chatHistory.text) {
                    const faq = await faqList.find(item => item.question.toLowerCase() === chatHistory.text.toLowerCase());

                    if (faq && faq.forState === 4) {
                        await MessageService.sendMessage(chatHistory.to, `Nomor tiket pengaduan anda adalah #${ticket.ticketNumber}. Silahkan tunggu konfirmasi paling lama dalam waktu 14 hari.`);
                        await TicketService.updateTicketChatState(ticket.id, 5);
                        await TicketService.updateTicketStatus(ticket.id, TICKET_STATUS.PENDING);
                        await TicketService.updateTicketExpiration(ticket.id, new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 0);
                    } else {
                        console.log("Pertanyaan salah")
                    }
                }
                break;
            case 5:
                if (chatHistory.text === "apakah masalah anda sudah diselesaikan oleh agent kami ?") {
                    await TicketService.updateTicketChatState(ticket.id, 6);
                } else {
                    await TicketService.updateTicketChatState(ticket.id, 7);
                    await MessageService.sendMessage(chatHistory.to, `Apakah solusi kami menyelesaikan permasalahan anda? [Sudah/Belum]`);
                }
        }
    }
}

module.exports = MessageService;
