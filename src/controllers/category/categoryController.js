const HTTP_STATUS = require("../../constants/httpStatus");
const categoryService = require("../../services/category/categoryService");

const getCategory = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(HTTP_STATUS.OK).json(categories);
  } catch (error) {
    next(error);
  }
};

const addCategory = async (req, res, next) => {
  const { name, department_code } = req.body;

  try {
    await categoryService.createCategory(name, department_code);
    res.status(HTTP_STATUS.CREATED).send("Success");
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategory, addCategory };
