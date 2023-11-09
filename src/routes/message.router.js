const express = require('express');
const MessageController = require('../controllers/message.controller');

const router = express.Router();

router.get("/broadcast", MessageController.getBroadcasts)

router.post('/send', MessageController.sendMessage);
router.post('/broadcast', MessageController.broadcastMessage);

module.exports = router;
