// Create this whole file just like department.service.js, but replace Department with Category and department with category.

const CategoryModel = require('../models/category.model');
const DepartmentModel = require('../models/department.model');

const CategoryService = {
    getAllCategory: async () => {
        try {
            const categories = await CategoryModel.getAllCategory();
            return categories;
        } catch (err) {
            console.error('Error in CategoryService.getAllCategory:', err);
            throw err;
        }
    },

    addCategory: async (categoryData) => {
        try {
            //Check first if departmentCode exists in Department table
            const department = await DepartmentModel.findDepartmentByCode(categoryData.departmentCode);
            if (!department) {
                throw new Error('Department does not exist');
            }
            const newCategoryId = await CategoryModel.addCategory(categoryData);
            return newCategoryId;
        } catch (err) {
            console.error('Error in CategoryService.addCategory:', err);
            throw err;
        }
    },

    updateCategory: async (categoryData) => {
        try {
            const result = await CategoryModel.updateCategory(categoryData);
            return result;
        } catch (err) {
            console.error('Error in CategoryService.updateCategory:', err);
            throw err;
        }
    },

    deleteCategory: async (categoryId) => {
        try {
            const result = await CategoryModel.deleteCategory(categoryId);
            return result;
        } catch (err) {
            console.error('Error in CategoryService.deleteCategory:', err);
            throw err;
        }
    },
};


module.exports = CategoryService;