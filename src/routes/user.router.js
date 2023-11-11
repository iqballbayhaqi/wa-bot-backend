const express = require('express');
const UserController = require('../controllers/user.controller'); // Adjust the path as needed
const { SUPER_ADMIN, AGENT } = require('../helpers/role');
const verifyAgentToken = require('../middlewares/verifyAgentToken');

const router = express.Router();

router.post('/login', UserController.login);
router.post('/register', verifyAgentToken([SUPER_ADMIN, AGENT]), UserController.register);
router.post('/refresh-token', UserController.refreshToken);

module.exports = router;
