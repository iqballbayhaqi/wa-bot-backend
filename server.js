const httpError = require("http-errors");
const bodyParser = require("body-parser");
const http = require("http");
const cron = require("node-cron");
const cors = require("cors");
const initSocket = require("./src/socket/socket");
require("dotenv").config();

const express = require("express");
const app = express();

// allow cors for websockets
app.use(cors(
  {
    origin: "http://localhost:4000",
    credentials: true
  }
));

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
const contactRouter = require("./src/routes/contact.router");
const broadcastJob = require("./src/cronjobs/broadcast.cronjob");
const ContactService = require("./src/services/contact.service");
const ConfigurationService = require("./src/services/configuration.service");

app.use("/api/v1", departmentRouter);
app.use("/api/v1", categoryRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", messageRouter);
app.use("/api/v1", ticketRouter);
app.use("/api/v1", webhookRouter);
app.use("/api/v1", questionRouter);
app.use("/api/v1", dashboardRouter);
app.use("/api/v1", contactRouter);

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

cron.schedule("0 * * * *", async function () {
  console.log("Checking for expired tickets...");
  const expiredTickets = await TicketService.getExpiredTickets();

  for (let i = 0; i < expiredTickets.length; i++) {
    const ticket = expiredTickets[i];
    if (ticket.hasExtended && ticket.status === TICKET_STATUS.PENDING) {
      await TicketService.updateTicketStatus(ticket.id, TICKET_STATUS.CLOSED);
      await ContactService.updateContactHasActiveTicket(ticket.phoneNumber, false)
    } else {
      await TicketService.extendExpiredTicket(
        ticket.id,
        ticket.expiryTime + 14 * 24 * 60 * 60 * 1000
      );

      await MessageService.sendMessage(
        ticket.phoneNumber,
        "Silahkan tunggu konfirmasi dari kami, tiket complain anda diperpanjang selama 14 hari"
      );
    }
  }
});

cron.schedule("0 * * * *", async function () {
  console.log("Running broadcast job...");
  const configuration = await ConfigurationService.getBroadcastConfig();
  const broadcastQuota = configuration.find(config => config.key === 'broadcast_quota').value;
  const sentMessages = configuration.find(config => config.key === 'sent_broadcast_message').value;
  const maximumBroadcastQuota = configuration.find(config => config.key === 'max_broadcast_quota').value;

  let { newQuota, sentMsg } = await broadcastJob(parseInt(broadcastQuota, 10), parseInt(sentMessages, 10), parseInt(maximumBroadcastQuota, 10));

  await ConfigurationService.updateBroadcastConfig(newQuota.toString(), sentMsg.toString());
});

initSocket(server);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
