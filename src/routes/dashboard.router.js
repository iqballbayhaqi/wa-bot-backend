const express = require('express');
const verifyAgentToken = require('../middlewares/verifyAgentToken');
const DashboardController = require('../controllers/dashboard.controller');
const { SUPER_ADMIN, AGENT } = require('../helpers/role');

const router = express.Router();

router.get('/dashboard', verifyAgentToken([SUPER_ADMIN, AGENT]), DashboardController.getDashboardInformation);

module.exports = router;
