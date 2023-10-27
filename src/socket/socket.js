const { Server } = require("socket.io");

const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        },
        keepAlive: true,
    });
    io.on("connection", (socket) => {
        console.log("Client connected");

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });

        socket.on("send", (payload) => {
            console.log("test send", payload)
            io.emit("receive", "Hello there!");
        });
    });
};

module.exports = initSocket;