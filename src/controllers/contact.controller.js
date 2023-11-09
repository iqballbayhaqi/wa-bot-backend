
//Create this controller just like department.controller.js, but replace Department with Category and department with category.
const ContactService = require('../services/contact.service');

const ContactController = {
    getAllContact: async (req, res) => {
        try {
            const contacts = await ContactService.getAllContact();
            res.json(contacts);
        } catch (err) {
            console.error('Error in CategoryController.getAllCategory:', err);
            res.status(500).send(err.message);
        }
    },
};

module.exports = ContactController;