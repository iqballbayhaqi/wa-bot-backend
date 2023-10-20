const UserModel = require('../models/users.model')
const DepartmentModel = require('../models/department.model')
const bcrypt = require('bcrypt');

const UserService = {
    createUser: async (userData) => {
        try {
            const user = await UserModel.findUserByNik(userData.nik)
            if (user) {
                const error = new Error('User already exists');
                error.statusCode = 409;
                throw error;
            }

            userData.hashPassword = await bcrypt.hash(userData.password, 10);
            delete userData.password;

            const newUserId = UserModel.createUser(userData)
            return newUserId
        } catch (err) {
            console.error('Error in UserService.createUser:', err)
            throw err
        }
    },

    findUserByNik: async (nik) => {
        try {
            const user = await UserModel.findUserByNik(nik)
            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }
            return user

        } catch (err) {
            throw err;
        }
    },

    isUserRegistered: async (nik) => {
        try {
            const user = await UserModel.findUserByNik(nik)
            return user ? true : false
        } catch (err) {
            console.error('Error in UserService.isNikExist:', err)
            throw err
        }
    },

    isAuthentic: async (password, hashPassword) => {
        try {
            const isAuthentic = await bcrypt.compare(password, hashPassword)
            return isAuthentic;
        } catch (err) {
            console.error('Error in UserService.isAuthentic:', err)
            throw err
        }
    }
}

module.exports = UserService;