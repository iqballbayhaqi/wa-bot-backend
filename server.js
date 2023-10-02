const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const departmentRouter = require("./src/routes/department/departmentRoute");
const categoryRouter = require("./src/routes/category/categoryRoute");

app.use("/api/v1/", departmentRouter);
app.use("/api/v1/", categoryRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
