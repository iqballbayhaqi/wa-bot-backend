// const axios = require('axios');
const BroadcastModel = require('../models/broadcast.model');
const ContactService = require('./contact.service');
const httpResponse = require('../helpers/httpResponse');

const BroadcastService = {
    createBroadcast: async (title, msg, type, selected) => {
        try {
            if (type == "all") {
                console.log("Broadcasting to all")
                const contactList = await ContactService.getAllContact().map(contact => { return { phoneNumber: contact.phoneNumber, isSent: false } });
                await BroadcastModel.createBroadcast(title, msg, JSON.stringify(contactList));
            }
            else if (type == "contact") {
                console.log("Broadcasting to selected contact")

                const contactList = selected.map(contact => { return { phoneNumber: contact, isSent: false } });
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
            }
        } catch (err) {
            console.log(err)
            throw err;
        }
    },

    getUncompletedBroadcast: async () => {
        try {
            const broadcast = await BroadcastModel.getUncompletedBroadcast();
            return broadcast;
        } catch (err) {
            console.log(err)
            throw err;
        }
    },

    updateBroadcast: async (id, numberList, isComplete) => {
        try {
            await BroadcastModel.updateBroadcast(id, numberList, isComplete);
        } catch (err) {
            console.log(err)
            throw err;
        }
    },

    getAllBroadcast: async () => {
        try {
            const broadcasts = await BroadcastModel.getAllBroadcast();
            return broadcasts;
        } catch (err) {
            console.log(err)
            throw err;
        }
    },

    getBroadcastDetail: async (id) => {
        try {
            const broadcast = await BroadcastModel.getBroadcastDetail(id);
            return broadcast;
        } catch (err) {
            console.log(err)
            throw err;
        }
    }

}

module.exports = BroadcastService;
