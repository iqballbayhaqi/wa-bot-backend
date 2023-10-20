const DepartmentModel = require('../models/department.model'); // Replace with the correct path to your DepartmentModel file

const DepartmentService = {
    getAllDepartments: async () => {
        try {
            const departments = await DepartmentModel.getAllDepartments();
            return departments;
        } catch (err) {
            console.error('Error in DepartmentService.getAllDepartments:', err);
            throw err;
        }
    },

    addDepartment: async (departmentData) => {
        try {
            const department = await DepartmentModel.getDepartmentByCode(departmentData.code);

            if (!!department) {
                const error = new Error('Department already exists');
                error.statusCode = 409;
                throw error;
            }

            const newDepartmentId = await DepartmentModel.addDepartment(departmentData);
            return newDepartmentId;
        } catch (err) {
            console.error('Error in DepartmentService.addDepartment:', err);
            throw err;
        }
    },

    updateDepartment: async (departmentData) => {
        try {
            const department = await DepartmentModel.getDepartmentById(departmentData.id);

            if (!department) {
                const error = new Error('Department not found');
                error.statusCode = 404;
                throw error;
            }

            const result = await DepartmentModel.updateDepartment(departmentData);
            return result;
        } catch (err) {
            console.error('Error in DepartmentService.updateDepartment:', err);
            throw err;
        }
    },

    deleteDepartment: async (departmentData) => {
        try {
            const department = await DepartmentModel.getDepartmentById(departmentData.id);

            if (!department) {
                const error = new Error('Department not found');
                error.statusCode = 404;
                throw error;
            }

            const result = await DepartmentModel.deleteDepartment(departmentData);
            return result;
        } catch (err) {
            console.error('Error in DepartmentService.deleteDepartment:', err);
            throw err;
        }
    },
};

module.exports = DepartmentService;
