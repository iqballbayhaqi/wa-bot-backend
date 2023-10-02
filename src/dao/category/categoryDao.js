const pool = require("../../../db");
const categoryQueries = require("../../queries/category/categoryQueries");

const getAllCategory = async () => {
  try {
    const result = await pool.query(categoryQueries.GET_CATEGORY);
    return result.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addCategory = async (categoryName, departmentCode) => {
  try {
    await pool.query(categoryQueries.ADD_CATEGORY, [
      categoryName,
      departmentCode,
    ]);
  } catch (error) {
    throw error;
  }
};

module.exports = { getAllCategory, addCategory };
