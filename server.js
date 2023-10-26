const httpError = require("http-errors");
const bodyParser = require("body-parser");
const cron = require("node-cron");

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
const ticketRouter = require("./src/routes/ticket.router")
const questionRouter = require("./src/routes/question.router")
const webhookRouter = require("./src/routes/webhook.router");
const TicketService = require("./src/services/ticket.service");
const MessageService = require("./src/services/message.service");

app.use("/api/v1", departmentRouter)
app.use("/api/v1", categoryRouter)
app.use("/api/v1", userRouter)
app.use("/api/v1", messageRouter)
app.use("/api/v1", ticketRouter)
app.use("/api/v1", webhookRouter)
app.use("/api/v1", questionRouter)

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

// Run task every 10 minute
cron.schedule("*/10 * * * *", async function () {
  console.log("running a task every 10 minute");
  const expiredContacts = await TicketService.getContactWithExpiredTicket();

  for (let i = 0; i < expiredContacts.length; i++) {
    const contact = expiredContacts[i];
    await MessageService.sendMessage(contact.phoneNumber, `Apakah masalah anda sudah diselesaikan oleh agent kami ?`);
  }

});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});