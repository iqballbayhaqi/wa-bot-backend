
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4200;
const http = require('http').Server(app);
const EventEmitter = require('events');
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

const eventEmitter = new EventEmitter();

const chatbot = require("./chatbot/chatbot")(eventEmitter);

let ticketList = [];

eventEmitter.on('newTicket', ticketDetail => {
    console.log("newTicket listen from app")
    ticketList.push(ticketDetail);
});

io.on('connection', (socket) => {
    setInterval(() => { // Generate some random data
        socket.emit('ticketList', ticketList);
    }, 5000);


    socket.on("sendMessage", (contact, message) => {
        chatbotEmitter.emit("sendMessage", { contact, message });
    })

    socket.on("resetState", () => {
        ticketList = [];
        eventEmitter.emit("resetState");
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

app.use(cors())

// Start the server
http.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
