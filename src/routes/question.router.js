const express = require('express');
const QuestionController = require('../controllers/question.controller');

const router = express.Router();

router.get('/question', QuestionController.getAllQuestion);

module.exports = router;
