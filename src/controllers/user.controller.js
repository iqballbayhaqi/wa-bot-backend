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
            const accessToken = jwt.sign(userData, process.env.PUBLIC_JWT_SECRET, { expiresIn: '15m' });
            const refreshToken = jwt.sign(userData, process.env.PUBLIC_JWT_SECRET, { expiresIn: '1h' });

            return httpResponse.success(res, { accessToken, refreshToken });
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
    },

    refreshToken: async (req, res) => {
        try {
            const { refreshToken } = req.body;

            // Check if refresh token is valid
            jwt.verify(refreshToken, process.env.PUBLIC_JWT_SECRET);
            // Get user data from refresh token
            const userData = jwt.decode(refreshToken);

            const newUserData = {
                id: userData.id,
                nik: userData.nik,
                name: userData.name,
                departmentCode: userData.departmentCode,
                role: userData.role
            }

            // Generate new access token
            const accessToken = jwt.sign(newUserData, process.env.PUBLIC_JWT_SECRET, { expiresIn: '15m' });
            const newRefreshToken = jwt.sign(newUserData, process.env.PUBLIC_JWT_SECRET, { expiresIn: '1h' });

            return httpResponse.success(res, { accessToken, refreshToken: newRefreshToken });
        } catch (err) {
            console.log(err)
            if (err.name === 'TokenExpiredError') {
                return httpResponse.unauthorized(res, 'Refresh token expired');
            }
            if (err.name === 'JsonWebTokenError') {
                return httpResponse.unauthorized(res, 'Invalid refresh token');
            }
            return httpResponse.error(res, "Internal Server Error");
        }
    }
}



module.exports = UserController;