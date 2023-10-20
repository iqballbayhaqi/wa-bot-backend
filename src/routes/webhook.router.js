const express = require('express');
const WebhookController = require('../controllers/webhook.controller'); // Adjust the path as needed

const router = express.Router();

router.post('/whatsapp-webhook', WebhookController.receiveCallback);

module.exports = router;
