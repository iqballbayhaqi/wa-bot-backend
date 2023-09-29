// services/departmentService.js
const departmentDao = require("../../dao/department/departmentDao");

const getAllDepartments = async () => {
  try {
    return await departmentDao.getAllDepartments();
  } catch (error) {
    throw error;
  }
};

const createDepartment = async (name, code) => {
  try {
    await departmentDao.addDepartment(name, code);
  } catch (error) {
    throw error;
  }
};

module.exports = { getAllDepartments, createDepartment };
