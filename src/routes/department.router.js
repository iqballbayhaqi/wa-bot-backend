const express = require('express');
const verifyAgentToken = require('../middlewares/verifyAgentToken');
const DepartmentController = require('../controllers/department.controller'); // Adjust the path as needed
const { SUPER_ADMIN, AGENT } = require('../helpers/role');

const router = express.Router();

router.get('/department', verifyAgentToken([SUPER_ADMIN, AGENT]), DepartmentController.getAllDepartments);
router.post('/department', verifyAgentToken([SUPER_ADMIN, AGENT]), DepartmentController.addDepartment);
router.put('/department', verifyAgentToken([SUPER_ADMIN, AGENT]), DepartmentController.updateDepartment);
router.delete('/department/:departmentId', verifyAgentToken([SUPER_ADMIN, AGENT]), DepartmentController.deleteDepartment);

module.exports = router;
