
//Create this controller just like department.controller.js, but replace Department with Category and department with category.
const QuestionService = require('../services/question.service');

const QuestionController = {
    getAllQuestion: async (req, res) => {
        try {
            const questions = await QuestionService.getAllQuestion();
            res.json(questions);
        } catch (err) {
            console.error('Error in CategoryController.getAllCategory:', err);
            res.status(500).send(err.message);
        }
    },
};

module.exports = QuestionController;