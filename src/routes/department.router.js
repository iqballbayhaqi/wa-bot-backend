const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const DepartmentController = require('../controllers/department.controller'); // Adjust the path as needed

const router = express.Router();

router.get('/department', verifyToken, DepartmentController.getAllDepartments);
router.post('/department', verifyToken, DepartmentController.addDepartment);
router.put('/department', verifyToken, DepartmentController.updateDepartment);
router.delete('/department/:departmentId', verifyToken, DepartmentController.deleteDepartment);

module.exports = router;
