const httpError = require("http-errors");

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const errorHandler = require('./src/middlewares/error-handler');

app.use(express.json());

// const departmentRouter = require("./src/routes/department/departmentRoute");
// const categoryRouter = require("./src/routes/category/categoryRoute");
// const agentRouter = require("./src/routes/agent/agentRoute");

// app.use("/api/v1/", departmentRouter);
// app.use("/api/v1/", categoryRouter);
// app.use("/api/v1/", agentRouter);

app.use("/users", require("./src/controllers/user.controller"))

app.use(async (req, res, next) => {
  next(httpError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
