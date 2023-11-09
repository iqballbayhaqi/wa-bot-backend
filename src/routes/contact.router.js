const express = require('express');
const ContactController = require('../controllers/contact.controller');
const verifyAgentToken = require('../middlewares/verifyAgentToken');

const router = express.Router();

router.get('/contact', verifyAgentToken, ContactController.getAllContact);

module.exports = router;
