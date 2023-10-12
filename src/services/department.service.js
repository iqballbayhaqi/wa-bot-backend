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
            const newDepartmentId = await DepartmentModel.addDepartment(departmentData);
            return newDepartmentId;
        } catch (err) {
            console.error('Error in DepartmentService.addDepartment:', err);
            throw err;
        }
    },

    updateDepartment: async (departmentData) => {
        try {
            //find if department exists
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

    deleteDepartment: async (departmentId) => {
        try {
            const department = await DepartmentModel.getDepartmentById(departmentId);

            if (!department) {
                const error = new Error('Department not found');
                error.statusCode = 404;
                throw error;
            }

            const result = await DepartmentModel.deleteDepartment(departmentId);
            return result;
        } catch (err) {
            console.error('Error in DepartmentService.deleteDepartment:', err);
            throw err;
        }
    },
};

module.exports = DepartmentService;
