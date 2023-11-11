const express = require('express');
const MessageController = require('../controllers/message.controller');
const verifyAgentToken = require('../middlewares/verifyAgentToken');
const { SUPER_ADMIN, AGENT } = require('../helpers/role');

const router = express.Router();

router.post('/send', verifyAgentToken([SUPER_ADMIN, AGENT]), MessageController.sendMessage);

router.get("/broadcast", verifyAgentToken([SUPER_ADMIN, AGENT]), MessageController.getBroadcasts);
router.get("/broadcast/:id", verifyAgentToken([SUPER_ADMIN, AGENT]), MessageController.getBroadcastDetail);
router.post('/broadcast', verifyAgentToken([SUPER_ADMIN, AGENT]), MessageController.broadcastMessage);

module.exports = router;
