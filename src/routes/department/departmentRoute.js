const express = require("express");
const router = express.Router();

const {
  getDepartment,
  addDepartment,
} = require("../../controllers/department/departmentController");

router.get("/department", getDepartment);

router.post("/department", addDepartment);

module.exports = router;
