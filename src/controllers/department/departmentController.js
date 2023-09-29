const HTTP_STATUS = require("../../constants/httpStatus");
const departmentService = require("../../services/department/departmentService");

const getDepartment = async (req, res) => {
  try {
    const departments = await departmentService.getAllDepartments();
    res.status(HTTP_STATUS.OK).json(departments);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send("Internal Server Error");
  }
};

const addDepartment = async (req, res) => {
  const { name, code } = req.body;

  try {
    await departmentService.createDepartment(name, code);
    res.status(HTTP_STATUS.CREATED).send("Success");
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send("Internal Server Error");
  }
};

module.exports = { getDepartment, addDepartment };
