const express = require('express');
const { WebhookController } = require('../controllers/webhook.controller');

const router = express.Router();

router.post('/whatsapp-webhook', WebhookController.receiveCallback);

module.exports = router;
