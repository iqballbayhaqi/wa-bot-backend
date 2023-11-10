const express = require('express');
const verifySuperAdminToken = require('../middlewares/verifySuperAdminToken');
const UserController = require('../controllers/user.controller'); // Adjust the path as needed

const router = express.Router();

router.post('/login', UserController.login);
router.post('/register', verifySuperAdminToken, UserController.register);
router.post('/refresh-token', UserController.refreshToken);

module.exports = router;
