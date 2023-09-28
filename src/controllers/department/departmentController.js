const pool = require("../../../db");

const getDepartment = (req, res) => {
  pool.query("SELECT * FROM department", (err, result) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      res.status(200).json(result.rows);
    }
  });
};

const addDepartment = (req, res) => {
  const { name, code } = req.body;

  pool.query(
    "INSERT INTO department (department_name, department_code) VALUES ($1, $2)",
    [name, code],
    (err, result) => {
      if (err) {
        console.log(err);
        throw err;
      } else {
        res.status(201).send("Success");
      }
    }
  );
};

module.exports = { getDepartment, addDepartment };
