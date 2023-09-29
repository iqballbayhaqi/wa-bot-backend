// dao/departmentDao.js
const pool = require("../../../db");
const departmentQueries = require("../../queries/department/departmentQueries");

const getAllDepartments = async () => {
  try {
    const result = await pool.query(departmentQueries.GET_DEPARTMENT);
    return result.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addDepartment = async (name, code) => {
  try {
    await pool.query(departmentQueries.ADD_DEPARTMENT, [name, code]);
  } catch (error) {
    throw error;
  }
};

module.exports = { getAllDepartments, addDepartment };
