const express = require('express');
const verifyAgentToken = require('../middlewares/verifyAgentToken');
const verifySuperAdminToken = require('../middlewares/verifySuperAdminToken');
const DepartmentController = require('../controllers/department.controller'); // Adjust the path as needed

const router = express.Router();

router.get('/department', verifyAgentToken, DepartmentController.getAllDepartments);
router.post('/department', verifyAgentToken, DepartmentController.addDepartment);
router.put('/department', verifyAgentToken, DepartmentController.updateDepartment);
router.delete('/department/:departmentId', verifyAgentToken, DepartmentController.deleteDepartment);

module.exports = router;
