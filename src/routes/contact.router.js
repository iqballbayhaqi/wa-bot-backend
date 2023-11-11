const express = require('express');
const ContactController = require('../controllers/contact.controller');
const verifyAgentToken = require('../middlewares/verifyAgentToken');
const { SUPER_ADMIN, AGENT } = require('../helpers/role');

const router = express.Router();

router.get('/contact', verifyAgentToken([SUPER_ADMIN, AGENT]), ContactController.getAllContact);

module.exports = router;
