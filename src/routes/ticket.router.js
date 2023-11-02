const express = require('express');
const TicketController = require('../controllers/ticket.controller');
const verifyAgentToken = require('../middlewares/verifyAgentToken');

const router = express.Router();

router.get('/tickets', verifyAgentToken, TicketController.getAllTickets);
router.get('/ticket/:id', verifyAgentToken, TicketController.getTicketById);
router.post('/moveTicket', verifyAgentToken, TicketController.moveTicket);

module.exports = router;
