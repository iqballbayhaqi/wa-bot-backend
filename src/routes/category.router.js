const express = require('express');
const CategoryController = require('../controllers/category.controller');
const verifyAgentToken = require('../middlewares/verifyAgentToken');
const verifySuperAdminToken = require('../middlewares/verifySuperAdminToken');

const router = express.Router();

router.get('/category', verifyAgentToken, CategoryController.getAllCategory);
router.post('/category', verifyAgentToken, CategoryController.addCategory);
router.put('/category', verifyAgentToken, CategoryController.updateCategory);
router.delete('/category/:categoryId', verifyAgentToken, CategoryController.deleteCategory);

module.exports = router;
