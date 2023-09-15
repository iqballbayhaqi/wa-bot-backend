const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const classifier = require("../classifiers/classifier");
const EventEmitter = require('events');

const client = new Client();
const contacts = new Map();
const chatbotEmitter = new EventEmitter();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', handleClientReady);

client.on('message', handleMessage);

client.initialize();

function handleClientReady() {
    console.log('Client is ready!');
}

function handleMessage(msg) {
    const contactId = msg.from;

    // Initialize contact information if not exists
    if (!contacts.has(contactId)) {
        contacts.set(contactId, {
            contactNumber: contactId,
            NIK: "",
            issuedDepartment: "",
            ticketNumber: "",
            currentState: 0,
            chatHistory: [],
        });
    }

    const contact = contacts.get(contactId);

    if (contact.currentState === 0) {
        handleGreetings(msg, contact)
    } else if (contact.currentState === 1) {
        handleNIKVerification(msg, contact)
    } else if (contact.currentState === 2) {
        handleComplaintMessage(msg, contact)
    } else {
        msg.reply('Terimakasih atas masukannya, Silahkan tunggu beberapa menit lagi untuk mengirimkan laporan lainnya');
    }
}

function handleGreetings(msg, contact) {
    if (msg.body.toLowerCase() === 'halo') {
        const botReply = 'Silahkan Masukkan NIK :';
        msg.reply(botReply);
        addToChatHistory(contact, msg.body, botReply);
        contact.currentState = 1; // Update state to 1 (waiting for NIK)
    } else {
        const botReply = 'Selamat datang, Ketik "halo" untuk memulai pengajuan komplain';
        msg.reply(botReply);
        addToChatHistory(contact, msg.body, botReply);
    }
}

function handleNIKVerification(msg, contact) {
    if (!isNaN(msg.body)) {
        const botMessage = "NIK anda terverifikasi, Silahkan ajukan komplain / pertanyaan anda"
        msg.reply(botMessage);
        contact.currentState = 2; // Update state to 2 (verified NIK)
        contact.NIK = msg.body;
        addToChatHistory(contact, msg.body, botMessage);
    } else {
        const botReply = 'Silahkan Masukkan NIK :';
        msg.reply(botReply);
        addToChatHistory(contact, msg.body, botReply);
    }
}

function handleComplaintMessage(msg, contact) {
    const predictedDepartment = classifier.classify(msg.body);
    const ticketNumber = getRandomNumber();
    const botMessage = `Terima kasih, complain dengan tiket nomor #${ticketNumber}
    akan diteruskan ke bagian ${predictedDepartment}`;

    msg.reply(botMessage);
    addToChatHistory(contact, msg.body, botMessage);
    contact.currentState = 0;
    contact.issuedDepartment = predictedDepartment;
    contact.ticketNumber = ticketNumber;

    console.log(contact)
    chatbotEmitter.emit("newTicket", contact)
}

function addToChatHistory(contact, senderMessage, botMessage) {
    const chatHistory = contact.chatHistory;
    chatHistory.push({ sender: 'sender', message: senderMessage });
    chatHistory.push({ sender: 'bot', message: botMessage });
}

function getRandomNumber() {
    const min = 1;
    const max = 9999;

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = function (eventEmitter) {
    chatbotEmitter.on('newTicket', data => {
        console.log("new ticket emit from chatbot");
        eventEmitter.emit('newTicket', data);
    });
};




