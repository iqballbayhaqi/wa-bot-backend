const express = require('express');
const TicketController = require('../controllers/ticket.controller');
const verifyAgentToken = require('../middlewares/verifyAgentToken');
const { SUPER_ADMIN, AGENT } = require('../helpers/role');

const router = express.Router();

router.get('/tickets', verifyAgentToken([SUPER_ADMIN, AGENT]), TicketController.getAllTickets);
router.get('/ticket/:id', verifyAgentToken([SUPER_ADMIN, AGENT]), TicketController.getTicketById);
router.post('/moveTicket', verifyAgentToken([SUPER_ADMIN, AGENT]), TicketController.moveTicket);

module.exports = router;
