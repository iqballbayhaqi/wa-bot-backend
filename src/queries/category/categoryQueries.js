const GET_CATEGORY = "SELECT * FROM category";
const ADD_CATEGORY =
  "INSERT INTO category (category_name, department_code) VALUES ($1, $2)";

module.exports = {
  GET_CATEGORY,
  ADD_CATEGORY,
};
