
//Create this controller just like department.controller.js, but replace Department with Category and department with category.

const httpResponse = require('../helpers/httpResponse');
const CategoryService = require('../services/category.service');
const getTokenUserId = require('../helpers/getTokenUserId');
const Joi = require('joi');
const validate = require('../middlewares/validate-request');

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
            const createdBy = getTokenUserId(req);

            const categoryData = { name, departmentCode, createdBy };
            await validate(addCategorySchema, categoryData);

            const newCategoryId = await CategoryService.addCategory(categoryData);
            return httpResponse.created(res, { newCategoryId });
        } catch (err) {
            if (err.isJoi) {
                return httpResponse.badrequest(res, err.message);
            }
            if (err.statusCode === 404) {
                return httpResponse.notfound(res, err.message);
            }
            console.log(err)
            return httpResponse.error(res, "Internal Server Error");
        }
    },

    updateCategory: async (req, res) => {
        try {
            const { id, name, departmentCode } = req.body;
            const lastModifiedBy = getTokenUserId(req);

            const categoryData = { id, name, departmentCode, lastModifiedBy };

            await validate(updateCategorySchema, categoryData);
            const result = await CategoryService.updateCategory(categoryData);

            return httpResponse.success(res, result);
        } catch (err) {
            if (err.isJoi) {
                return httpResponse.badrequest(res, err.message);
            }
            if (err.statusCode === 404) {
                return httpResponse.notfound(res, err.message);
            }
            return httpResponse.error(res, "Internal Server Error");
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const categoryId = req.params.categoryId;
            const lastModifiedBy = getTokenUserId(req);

            const categoryData = { id: categoryId, lastModifiedBy };

            const result = await CategoryService.deleteCategory(categoryData);

            return httpResponse.success(res, result);
        } catch (err) {
            if (err.isJoi) {
                return httpResponse.badrequest(res, err.message);
            }
            if (err.statusCode === 404) {
                return httpResponse.notfound(res, err.message);
            }
            res.status(500).send(err.message);
        }
    },
};

const addCategorySchema = Joi.object({
    name: Joi.string().required(),
    departmentCode: Joi.string().required(),
    createdBy: Joi.number().required(),
});

const updateCategorySchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    departmentCode: Joi.string().required(),
    lastModifiedBy: Joi.number().required(),
});

module.exports = CategoryController;