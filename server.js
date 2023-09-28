const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const departmentRouter = require("./src/routes/department/departmentRoute");

app.use("/api/v1/", departmentRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
