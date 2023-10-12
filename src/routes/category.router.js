const express = require('express');
const CategoryController = require('../controllers/category.controller');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/category', verifyToken, CategoryController.getAllCategory);
router.post('/category', verifyToken, CategoryController.addCategory);
router.put('/category', verifyToken, CategoryController.updateCategory);
router.delete('/category/:categoryId', verifyToken, CategoryController.deleteCategory);

module.exports = router;
