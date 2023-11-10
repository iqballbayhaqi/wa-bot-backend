const express = require('express');
const verifyAgentToken = require('../middlewares/verifyAgentToken');
const QuestionController = require('../controllers/question.controller');

const router = express.Router();

router.get('/question', verifyAgentToken, QuestionController.getAllQuestion);

module.exports = router;
