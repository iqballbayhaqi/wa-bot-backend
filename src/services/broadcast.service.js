// const axios = require('axios');
const BroadcastModel = require('../models/broadcast.model');
const ContactService = require('./contact.service');
const TicketService = require('./ticket.service');

const BroadcastService = {
    createBroadcast: async (title, msg, type, selected) => {
        try {
            if (type == "all") {
                console.log("Broadcasting to all")

                const contactList = await selected.map(contact => { return { phoneNumber: contact, isSent: false } });
                await BroadcastModel.createBroadcast(title, msg, JSON.stringify(contactList));

            } else if (type == "department") {
                console.log("Broadcasting to department")
                let contact = [];

                for (let i = 0; i < selected.length; i++) {
                    contact = contact.concat(await ContactService.getContactWithLastTicketByDepartment(selected[i])).map(item => item.phoneNumber);
                }

                const unique = [...new Set(contact)];
                const contactList = await unique.map(number => { return { phoneNumber: number, isSent: false } });
                await BroadcastModel.createBroadcast(title, msg, JSON.stringify(contactList));

            } else if (type == "category") {
                console.log("Broadcasting to category")
                let contact = [];

                for (let i = 0; i < selected.length; i++) {
                    contact = contact.concat(await ContactService.getContactWithLastTicketByCategory(selected[i]));
                }

                const unique = [...new Set(contact)];
                const contactList = await unique.map(number => { return { phoneNumber: number, isSent: false } });

                await BroadcastModel.createBroadcast(ttile, msg, JSON.stringify(contactList));
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
    },

    getAllBroadcast: async () => {
        try {
            const broadcasts = await BroadcastModel.getAllBroadcast();
            return broadcasts;
        } catch (err) {
            console.log(err)
            return httpResponse.error(res, "Internal Server Error");
        }
    },

    getBroadcastDetail: async (id) => {
        try {
            const broadcast = await BroadcastModel.getBroadcastDetail(id);
            return broadcast;
        } catch (err) {
            console.log(err)
            return httpResponse.error(res, "Internal Server Error");
        }
    }
    
}

module.exports = BroadcastService;
