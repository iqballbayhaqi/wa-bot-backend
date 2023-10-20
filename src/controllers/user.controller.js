const httpResponse = require('../helpers/httpResponse');
const UserService = require('../services/user.service')
const Joi = require('joi');
const validate = require('../middlewares/validate-request');
const jwt = require('jsonwebtoken');

const createUsersSchema = Joi.object({
    nik: Joi.string().required(),
    name: Joi.string().required(),
    password: Joi.string().required(),
    departmentCode: Joi.string().required()
});

const UserController = {
    register: async (req, res) => {
        try {
            const { nik, name, password, departmentCode } = req.body;
            const userData = { nik, name, password, departmentCode };

            // Validate user input, trigger joi error if not valid
            await validate(createUsersSchema, userData);

            const isRegistered = await UserService.isUserRegistered(nik);

            if (isRegistered) {
                return httpResponse.conflict(res, 'User already exists');
            }

            const newUserId = await UserService.createUser(userData);

            return httpResponse.created(res, { newUserId });
        } catch (err) {
            if (err.isJoi) {
                return httpResponse.badrequest(res, err.message);
            }
            if (err.statusCode === 409) {
                return httpResponse.conflict(res, err.message);
            }
            if (err.statusCode === 404) {
                return httpResponse.notfound(res, err.message);
            }
            return httpResponse.error(res, "Internal Server Error");
        }
    },

    login: async (req, res) => {
        try {
            const { nik, password } = req.body;

            // Check if user is registered
            const user = await UserService.findUserByNik(nik);
            if (!user) {
                return httpResponse.unauthorized(res, 'Nik not found or wrong password');
            }


            // Check if password is correct
            const isAuthentic = await UserService.isAuthentic(password, user.hashPassword);
            if (!isAuthentic) {
                return httpResponse.unauthorized(res, 'Nik not found or wrong password');
            }

            const userData = {
                id: user.id,
                nik: user.nik,
                name: user.name,
                departmentCode: user.departmentCode,
                role: user.role
            }

            // Generate token
            const token = jwt.sign(userData, process.env.PUBLIC_JWT_SECRET, { expiresIn: '1h' });

            return httpResponse.success(res, { token });
        } catch (err) {
            if (err.isJoi) {
                return httpResponse.badrequest(res, err.message);
            }
            if (err.statusCode === 404) {
                return httpResponse.notfound(res, err.message);
            }
            if (err.statusCode === 401) {
                return httpResponse.unauthorized(res, err.message);
            }
            return httpResponse.error(res, "Internal Server Error");
        }
    }
}



module.exports = UserController;