const AsyncLock = require('async-lock');
const { selfMessageHandler, receiveMessageHandler } = require('../services/message.service');
const eventEmitter = require('../event/event')

const WebhookController = {
    receiveCallback: async (req, res) => {
        const { body } = req;
        let chatHistory = {}

        console.log(body)

        if (!!body.fromMe) {
            chatHistory = { ...body }
            console.log("self message handler")
            await selfMessageHandler(chatHistory)
            await eventEmitter.emit("callback", chatHistory)
        } else {
            chatHistory = { ...body }
            console.log("receive message handler")
            await receiveMessageHandler(chatHistory)
            await eventEmitter.emit("callback", chatHistory)
        }

        return res.status(200).json({
            "message": "callback received"
        })
    },
}

module.exports = { WebhookController, eventEmitter }