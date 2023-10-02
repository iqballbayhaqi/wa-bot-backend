const HTTP_STATUS = require("../../constants/httpStatus");
const categoryService = require("../../services/category/categoryService");

const getCategory = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(HTTP_STATUS.OK).json(categories);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send("Internal Server Error");
  }
};

const addCategory = async (req, res) => {
  const { name, department_code } = req.body;

  try {
    await categoryService.createCategory(name, department_code);
    res.status(HTTP_STATUS.CREATED).send("Success");
  } catch (error) {
    if (error.message === "400") {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send("Department code not found");
    }

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send("Internal Server Error");
  }
};

module.exports = { getCategory, addCategory };
