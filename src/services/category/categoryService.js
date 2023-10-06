// services/categoryService.js
const categoryDao = require("../../dao/category/categoryDao");
const departmentDao = require("../../dao/department/departmentDao");
const httpError = require("http-errors");

const getAllCategories = async () => {
  try {
    return await categoryDao.getAllCategory();
  } catch (error) {
    throw error;
  }
};

const createCategory = async (name, code) => {
  try {
    const allDepartment = await departmentDao.getAllDepartments();
    const isValid = await isValidDepartment(code, allDepartment);

    if (isValid) {
      await categoryDao.addCategory(name, code);
    } else {
      throw httpError.BadRequest("Department not found");
    }
  } catch (error) {
    throw error;
  }
};

const isValidDepartment = async (code, department) => {
  return (
    (await department.filter((dept) => dept.department_code === code)
      .length) !== 0
  );
};

module.exports = { getAllCategories, createCategory };
