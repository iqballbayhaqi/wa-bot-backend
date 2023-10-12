const express = require('express');
const UserController = require('../controllers/user.controller'); // Adjust the path as needed

const router = express.Router();

router.post('/login', UserController.login);
router.post('/register', UserController.register);

module.exports = router;
