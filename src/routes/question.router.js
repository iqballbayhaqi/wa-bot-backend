const express = require('express');
const verifyAgentToken = require('../middlewares/verifyAgentToken');
const QuestionController = require('../controllers/question.controller');
const { SUPER_ADMIN, AGENT } = require('../helpers/role');

const router = express.Router();

router.get('/question', verifyAgentToken([SUPER_ADMIN, AGENT]), QuestionController.getAllQuestion);

module.exports = router;
