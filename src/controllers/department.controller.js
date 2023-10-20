const DepartmentService = require('../services/department.service');
const getTokenUserId = require('../helpers/getTokenUserId');

const Joi = require('joi');
const validate = require('../middlewares/validate-request');
const httpResponse = require('../helpers/httpResponse');

const DepartmentController = {
    getAllDepartments: async (req, res) => {
        try {
            const departments = await DepartmentService.getAllDepartments();

            return httpResponse.success(res, departments);
        } catch (err) {
            return httpResponse.error(res, "Internal Server Error");
        }
    },

    addDepartment: async (req, res) => {
        try {
            const { name, code } = req.body;

            const createdBy = getTokenUserId(req);

            const departmentData = { name, code, createdBy };
            await validate(createDepartmentSchema, departmentData);
            await DepartmentService.addDepartment(departmentData);

            return httpResponse.success(res, "Department added successfully");
        } catch (err) {
            if (err.isJoi) {
                return httpResponse.badrequest(res, err.message);
            }
            if (err.statusCode === 409) {
                return httpResponse.conflict(res, err.message);
            }
            return httpResponse.error(res, "Internal Server Error");
        }
    },

    updateDepartment: async (req, res) => {
        try {
            const { id, name, code } = req.body;
            const lastModifiedBy = getTokenUserId(req);

            const departmentData = { id, name, code, lastModifiedBy };
            await validate(updateDepartmentSchema, departmentData);

            const result = await DepartmentService.updateDepartment(departmentData);

            return httpResponse.success(res, result);
        } catch (err) {
            if (err.isJoi) {
                return httpResponse.badrequest(res, err.message);
            }
            if (err.statusCode === 404) {
                return httpResponse.notfound(res, err.message);
            }
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteDepartment: async (req, res) => {
        try {
            const { departmentId } = req.params;
            const lastModifiedBy = getTokenUserId(req);

            const departmentData = { id: departmentId, lastModifiedBy };
            await validate(deleteDepartmentSchema, departmentData);

            const result = await DepartmentService.deleteDepartment(departmentData);

            return httpResponse.success(res, result);
        } catch (err) {
            if (err.isJoi) {
                return httpResponse.badrequest(res, err.message);
            }
            if (err.statusCode === 404) {
                return httpResponse.notfound(res, err.message);
            }
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};

const createDepartmentSchema = Joi.object({
    name: Joi.string().required(),
    code: Joi.string().required(),
    createdBy: Joi.number().required(),
});

const updateDepartmentSchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    code: Joi.string().required(),
});

const deleteDepartmentSchema = Joi.object({
    id: Joi.number().required(),
});

module.exports = DepartmentController;
