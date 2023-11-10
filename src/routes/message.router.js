const express = require('express');
const MessageController = require('../controllers/message.controller');
const verifyAgentToken = require('../middlewares/verifyAgentToken');

const router = express.Router();

router.post('/send', verifyAgentToken, MessageController.sendMessage);

router.get("/broadcast", verifyAgentToken, MessageController.getBroadcasts);
router.get("/broadcast/:id", verifyAgentToken, MessageController.getBroadcastDetail);
router.post('/broadcast', verifyAgentToken, MessageController.broadcastMessage);

module.exports = router;
