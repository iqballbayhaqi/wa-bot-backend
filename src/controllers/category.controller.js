
//Create this controller just like department.controller.js, but replace Department with Category and department with category.

const CategoryService = require('../services/category.service');
const Joi = require('joi');

const CategoryController = {
    getAllCategory: async (req, res) => {
        try {
            const categories = await CategoryService.getAllCategory();
            res.json(categories);
        } catch (err) {
            console.error('Error in CategoryController.getAllCategory:', err);
            res.status(500).send(err.message);
        }
    },

    addCategory: async (req, res) => {
        try {
            const { name, departmentCode } = req.body

            const categoryData = { name, departmentCode };
            await validate(addCategorySchema, categoryData);


        } catch (err) {

        }
    },

    updateCategory: async (req, res) => {
        try {
            const { error } = updateCategorySchema.validate(req.body);
            if (error) {
                throw new Error(error.details[0].message);
            }
            const result = await CategoryService.updateCategory(req.body);
            res.json(result);
        } catch (err) {
            console.error('Error in CategoryController.updateCategory:', err);
            res.status(500).send(err.message);
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const categoryId = req.params.id;
            const result = await CategoryService.deleteCategory(categoryId);
            res.json(result);
        } catch (err) {
            console.error('Error in CategoryController.deleteCategory:', err);
            res.status(500).send(err.message);
        }
    },
};

const addCategorySchema = Joi.object({
    name: Joi.string().required(),
    departmentCode: Joi.string().required(),
});

const updateCategorySchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    departmentCode: Joi.string().required(),
});

module.exports = CategoryController;