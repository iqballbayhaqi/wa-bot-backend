const ContactModel = require('../models/contact.model');

const ContactService = {
    createContact: async (contactData) => {
        try {
            const newContactId = await ContactModel.createContact(contactData);
            return newContactId;
        } catch (err) {
            console.error('Error in ContactService.createContact:', err);
            throw err;
        }
    },

    getAllContact: async () => {
        try {
            const contacts = await ContactModel.getAllContact();
            return contacts;
        } catch (err) {
            console.error('Error in ContactService.getAllContact:', err);
            throw err;
        }
    },

    getAllEmployeeContact: async () => {
        try {
            const contacts = await ContactModel.getAllEmployeeContact();
            return contacts;
        } catch (err) {
            console.error('Error in ContactService.getAllEmployeeContact:', err);
            throw err;
        }
    },

    updateContactEmploymentStatus: async (phoneNumber, isEmployee) => {
        try {
            await ContactModel.updateContactEmploymentStatus(phoneNumber, isEmployee);
        } catch (err) {
            console.error('Error in ContactService.updateContactEmploymentStatus:', err);
            throw err;
        }
    },

    findContactByPhoneNumber: async (phoneNumber) => {
        try {
            const contact = await ContactModel.findContactByPhoneNumber(phoneNumber);
            return contact;
        } catch (err) {
            console.error('Error in ContactService.findContactByPhoneNumber:', err);
            throw err;
        }
    },

    isContactExist: async (phoneNumber) => {
        try {
            const contact = await ContactModel.findContactByPhoneNumber(phoneNumber);
            return !!contact;
        } catch (err) {
            console.error('Error in ContactService.isContactExist:', err);
            throw err;
        }
    },

    getContactChatHistory: async (phoneNumber) => {
        try {
            const chatHistory = await ContactModel.getContactChatHistory(phoneNumber);
            return chatHistory;
        } catch (err) {
            console.error('Error in ContactService.getContactChatHistory:', err);
            throw err;
        }
    },

    updateContactChatHistory: async (phoneNumber, chatHistory) => {
        try {
            let prevChatHistory = await ContactModel.getContactChatHistory(phoneNumber);

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

                jsonChat[index] = { ...jsonChat[index], ...chatHistory };
            } else {
                jsonChat.push(chatHistory);
            }

            const stringChat = JSON.stringify(jsonChat);
            await ContactModel.updateContactChatHistory(phoneNumber, stringChat);

        } catch (err) {
            console.error('Error in ContactService.updateContactChatHistory:', err);
            throw err;
        }
    },

    updateContactHasActiveTicket: async (phoneNumber, hasActiveTicket) => {
        try {
            await ContactModel.updateContactHasActiveTicket(phoneNumber, hasActiveTicket);
        } catch (err) {
            console.error('Error in ContactService.updateContactHasActiveTicket:', err);
            throw err;
        }
    },

    getContactWithLastTicketByDepartment: async (departmentId) => {
        try {
            const contacts = await ContactModel.getContactWithLastTicketByDepartment(departmentId);
            return contacts;
        } catch (err) {
            console.error('Error in ContactService.getContactWithLastTicketByDepartment:', err);
            throw err;
        }
    },

    getContactWithLastTicketByCategory: async (categoryId) => {
        try {
            const contacts = await ContactModel.getContactWithLastTicketByCategory(categoryId);
            return contacts;
        } catch (err) {
            console.error('Error in ContactService.getContactWithLastTicketByCategory:', err);
            throw err;
        }
    }

};

module.exports = ContactService;