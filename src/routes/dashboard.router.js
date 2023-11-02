const express = require('express');
const verifyAgentToken = require('../middlewares/verifyAgentToken');
const DashboardController = require('../controllers/dashboard.controller');

const router = express.Router();

router.get('/dashboard', verifyAgentToken, DashboardController.getDashboardInformation);

module.exports = router;
