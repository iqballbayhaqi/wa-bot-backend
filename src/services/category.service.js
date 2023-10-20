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
            const department = await DepartmentModel.getDepartmentByCode(categoryData.departmentCode);
            if (!department) {
                const error = new Error("Department not found");
                error.statusCode = 404;
                throw error;
            }
            const newCategoryId = await CategoryModel.addCategory(categoryData);
            return newCategoryId;
        } catch (err) {
            throw err;
        }
    },

    updateCategory: async (categoryData) => {
        try {
            //find if category exists
            const category = await CategoryModel.getCategoryById(categoryData.id);

            if (!category) {
                const error = new Error('Category not found');
                error.statusCode = 404;
                throw error;
            }

            //Check first if departmentCode exists in Department table
            const department = await DepartmentModel.getDepartmentByCode(categoryData.departmentCode);
            if (!department) {
                const error = new Error("Department not found");
                error.statusCode = 404;
                throw error;
            }

            const result = await CategoryModel.updateCategory(categoryData);
            return result;
        } catch (err) {
            throw err;
        }
    },

    deleteCategory: async (categoryData) => {
        try {
            console.log(categoryData)
            const category = await CategoryModel.getCategoryById(categoryData.id);

            if (!category) {
                const error = new Error('Category not found');
                error.statusCode = 404;
                throw error;
            }

            const result = await CategoryModel.deleteCategory(categoryData);
            return result;
        } catch (err) {
            throw err;
        }
    },
};


module.exports = CategoryService;