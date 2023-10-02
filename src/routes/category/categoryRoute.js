const express = require("express");
const router = express.Router();

const {
  getCategory,
  addCategory,
} = require("../../controllers/category/categoryController");

router.get("/category", getCategory);

router.post("/category", addCategory);

module.exports = router;
