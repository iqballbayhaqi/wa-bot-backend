const QuestionModel = require('../models/question.model');

const QuestionService = {
    getAllQuestion: async () => {
        try {
            const questions = await QuestionModel.getAllQuestion();
            return questions;
        } catch (err) {
            console.error('Error in QuestionService.getAllQuestion:', err);
            throw err;
        }
    }

};

module.exports = QuestionService;