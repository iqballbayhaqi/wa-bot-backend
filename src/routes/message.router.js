const express = require('express');
const MessageController = require('../controllers/message.controller');

const router = express.Router();

router.post('/send', MessageController.sendMessage);
router.get('/send', MessageController.sendMessage);

module.exports = router;
