
const express = require('express');
const chatbot = require("./chatbot/chatbot")

const app = express();
const port = process.env.PORT || 3000;

// Define a basic route
app.get('/', (req, res) => {
    res.send('Hello, Express.js!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});