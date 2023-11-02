const { Server } = require("socket.io");
const eventEmitter = require("../event/event");
const MessageService = require("../services/message.service");

const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:4000",
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        },
        keepAlive: true,
    });

    io.on("connection", (socket) => {
        console.log("Client connected");

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });

        socket.on("send", ({ to, msg }) => {
            MessageService.sendMessage(to, msg);
        });

        socket.on("broadcast", ({ to, msg }) => {
            console.log("Broadcasting messages to :", { to, msg });
        })
    });

    eventEmitter.on("callback", (data) => {
        io.emit("callback", data);
    });
};

module.exports = initSocket;