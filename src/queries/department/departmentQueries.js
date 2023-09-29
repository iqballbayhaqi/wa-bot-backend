const GET_DEPARTMENT = "SELECT * FROM department";
const ADD_DEPARTMENT =
  "INSERT INTO department (department_name, department_code) VALUES ($1, $2)";

module.exports = {
  GET_DEPARTMENT,
  ADD_DEPARTMENT,
};
