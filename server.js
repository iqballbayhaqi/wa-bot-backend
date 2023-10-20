const httpError = require("http-errors");
const bodyParser = require("body-parser");

require('dotenv').config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const errorHandler = require('./src/middlewares/error-handler');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const departmentRouter = require("./src/routes/department.router")
const categoryRouter = require("./src/routes/category.router")
const userRouter = require("./src/routes/user.router")
const messageRouter = require("./src/routes/message.router")
const webhookRouter = require("./src/routes/webhook.router")

app.use("/api/v1", departmentRouter)
app.use("/api/v1", categoryRouter)
app.use("/api/v1", userRouter)
app.use("/api/v1", messageRouter)
app.use("/api/v1", webhookRouter)

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
