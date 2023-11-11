const express = require('express');
const CategoryController = require('../controllers/category.controller');
const verifyAgentToken = require('../middlewares/verifyAgentToken');
const { SUPER_ADMIN, AGENT } = require('../helpers/role');

const router = express.Router();

router.get('/category', verifyAgentToken([SUPER_ADMIN, AGENT]), CategoryController.getAllCategory);
router.post('/category', verifyAgentToken([SUPER_ADMIN, AGENT]), CategoryController.addCategory);
router.put('/category', verifyAgentToken([SUPER_ADMIN, AGENT]), CategoryController.updateCategory);
router.delete('/category/:categoryId', verifyAgentToken([SUPER_ADMIN, AGENT]), CategoryController.deleteCategory);

module.exports = router;
