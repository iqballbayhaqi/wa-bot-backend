
const express = require('express');
const http = require('http');
const EventEmitter = require('events');
const socketIo = require('socket.io');

const eventEmitter = new EventEmitter();

const chatbot = require("./chatbot/chatbot")(eventEmitter);

const ticketList = [];

eventEmitter.on('newTicket', ticketDetail => {
    console.log("newTicket listen from app")
    console.log(ticketDetail);
    ticketList.push(ticketDetail);

    socket.emit('message', ticketList);
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 4200;

io.on('connection', (socket) => {
    console.log('A user connected');

    // Define custom events here
    socket.on('chat message', (message) => {
        console.log(`Message: ${message}`);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Define a basic route
app.get('/', (req, res) => {
    res.send(ticketList)
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});