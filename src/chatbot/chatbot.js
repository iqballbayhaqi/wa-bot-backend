const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const classifier = require("../classifiers/classifier");

const client = new Client();
const contactStates = new Map();
const contactChatHistories = new Map();

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
    if (!contactStates.has(contactId)) {
        contactStates.set(contactId, 0); // Initial state is 0
        contactChatHistories.set(contactId, {
            contactNumber: contactId,
            currentState: 0, // Initial state is 0
            chatHistory: [],
        });
    }

    const currentState = contactStates.get(contactId);

    if (currentState === 0) {
        handleGreetings(msg, contactId)
    } else if (currentState === 1) {
        handleNIKVerification(msg, contactId)
    } else if (currentState === 2) {
        handleComplaintMessage(msg, contactId)
    } else {
        msg.reply('Terimakasih atas masukannya, Silahkan tunggu beberapa menit lagi untuk mengirimkan laporan lainnya');
    }
}

function handleGreetings(msg, contactId) {
    if (msg.body.toLowerCase() === 'halo') {
        msg.reply('Silahkan Masukkan NIK :');
        contactStates.set(contactId, 1); // Update state to 1 (waiting for NIK)
    } else {
        msg.reply('Selamat datang, Ketik "halo" untuk memulai pengajuan komplain');
    }
}

function handleNIKVerification(msg, contactId) {
    if (!isNaN(msg.body)) {
        msg.reply('NIK anda terverifikasi, Silahkan ajukan komplain / pertanyaan anda');
        contactStates.set(contactId, 2); // Update state to 2 (verified NIK)
        addToChatHistory(contactId, msg.body);
    } else {
        msg.reply('Silahkan Masukkan NIK :');
    }
}

function handleComplaintMessage(msg, contactId) {
    const predictedDepartment = classifier.classify(msg.body);
    msg.reply(`Terima kasih, complain dengan tiket nomor #${contactId} akan diteruskan ke bagian ${predictedDepartment}`);
    contactStates.set(contactId, 3); // Update state to 3 (complaint ticket issued)
    addToChatHistory(contactId, msg.body);
}

function addToChatHistory(contactId, message) {
    const chatHistory = contactChatHistories.get(contactId).chatHistory;
    chatHistory.push(message);
}
