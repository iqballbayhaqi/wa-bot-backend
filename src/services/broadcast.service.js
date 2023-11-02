// const axios = require('axios');
const BroadcastModel = require('../models/broadcast.model');
const ContactService = require('./contact.service');
const TicketService = require('./ticket.service');
// const QuestionService = require('./question.service');
// const TICKET_STATUS = require('../helpers/ticketStatus');

// const MESSAGE_TYPE = 'text';

const BroadcastService = {
    createBroadcast: async (msg, type, filter) => {
        try {
            if (type == "all") {
                console.log("Broadcasting to all")
                const contacts = await ContactService.getAllEmployeeContact();
                const contactList = await contacts.map(contact => { return { phoneNumber: contact.phoneNumber, isSent: false } });

                await BroadcastModel.createBroadcast(msg, JSON.stringify(contactList));

            } else if (type == "department") {
                console.log("Broadcasting to department")
                const tickets = await TicketService.getActiveTicketByDepartment(filter)

                const contactList = await tickets.map(ticket => { return { phoneNumber: ticket.phoneNumber, isSent: false } });

                await BroadcastModel.createBroadcast(msg, JSON.stringify(contactList));

            } else if (type == "category") {
                console.log("Broadcasting to category")
                const tickets = await TicketService.getActiveTicketByCategory(filter)

                const contactList = await tickets.map(ticket => { return { phoneNumber: ticket.phoneNumber, isSent: false } });

                await BroadcastModel.createBroadcast(msg, JSON.stringify(contactList));

            } else {
                return httpResponse.badrequest(res, "Invalid type");
            }
        } catch (err) {
            console.log(err)
            return httpResponse.error(res, "Internal Server Error");
        }
    },

    getUncompletedBroadcast: async () => {
        try {
            const broadcast = await BroadcastModel.getUncompletedBroadcast();
            return broadcast;
        } catch (err) {
            console.log(err)
            return httpResponse.error(res, "Internal Server Error");
        }
    },

    updateBroadcast: async (id, numberList, isComplete) => {
        try {
            await BroadcastModel.updateBroadcast(id, numberList, isComplete);
        } catch (err) {
            console.log(err)
            return httpResponse.error(res, "Internal Server Error");
        }
    }
}

module.exports = BroadcastService;
