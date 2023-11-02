const httpError = require("http-errors");
const bodyParser = require("body-parser");
const http = require("http");
const cron = require("node-cron");
const initSocket = require("./src/socket/socket");

require("dotenv").config();

const express = require("express");
const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3000;

const errorHandler = require("./src/middlewares/error-handler");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const departmentRouter = require("./src/routes/department.router");
const categoryRouter = require("./src/routes/category.router");
const userRouter = require("./src/routes/user.router");
const messageRouter = require("./src/routes/message.router");
const ticketRouter = require("./src/routes/ticket.router");
const questionRouter = require("./src/routes/question.router");
const webhookRouter = require("./src/routes/webhook.router");
const dashboardRouter = require("./src/routes/dashboard.router");
const TicketService = require("./src/services/ticket.service");
const TICKET_STATUS = require("./src/helpers/ticketStatus");
const BroadcastService = require("./src/services/broadcast.service");
const MessageService = require("./src/services/message.service");
const broadcastJob = require("./src/cronjobs/broadcast.cronjob");

app.use("/api/v1", departmentRouter);
app.use("/api/v1", categoryRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", messageRouter);
app.use("/api/v1", ticketRouter);
app.use("/api/v1", webhookRouter);
app.use("/api/v1", questionRouter);
app.use("/api/v1", dashboardRouter);

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

app.use(errorHandler);

cron.schedule("* * * * * ", async function () {
  console.log("running a task every minute");
  const expiredTickets = await TicketService.getExpiredTickets();

  for (let i = 0; i < expiredTickets.length; i++) {
    const ticket = expiredTickets[i];
    if (ticket.hasExtended && ticket.status === TICKET_STATUS.PENDING) {
      await TicketService.updateTicketStatus(ticket.id, TICKET_STATUS.CLOSED);
    } else {
      await TicketService.extendExpiredTicket(
        ticket.id,
        ticket.expiryTime + 60 * 1000
      );
    }
  }

  console.log(expiredTickets);
});

let broadcastQuota = 5;
let sentMessages = 0;
let maximumBroadcastQuota = 300;

// run task every 1 hour
cron.schedule("0 * * * *", async function () {
  let { newQuota, sentMsg } = await broadcastJob(broadcastQuota, sentMessages, maximumBroadcastQuota);
  broadcastQuota = newQuota;
  sentMessages = sentMsg;
});

initSocket(server);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
