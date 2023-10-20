const ContactService = require('../services/contact.service');
const AsyncLock = require('async-lock');
const { selfMessageHandler, receiveMessageHandler } = require('../services/message.service');

const lock = new AsyncLock();

const WebhookController = {
    receiveCallback: async (req, res) => {
        const { body } = req;
        let chatHistory = {}

        await lock.acquire('chatHistory', async () => {
            if (!!body.fromMe) {
                chatHistory = { ...body }
                console.log("self message handler")
                await selfMessageHandler(chatHistory)

                // const isContactExist = await ContactService.isContactExist(chatHistory.to);
                // if (!isContactExist) {
                //     await ContactService.createContact({
                //         phoneNumber: chatHistory.to
                //     });
                // }
                // await ContactService.updateContactChatHistory(chatHistory.to, chatHistory);


            } else {
                chatHistory = { ...body }
                console.log("receive message handler")
                await receiveMessageHandler(chatHistory)

                // const isContactExist = await ContactService.isContactExist(chatHistory.from);

                // if (!isContactExist) {
                //     await ContactService.createContact({
                //         phoneNumber: chatHistory.from
                //     });
                // }

                // await ContactService.updateContactChatHistory(chatHistory.from, chatHistory);
            }
        });

        return res.status(200).json({
            "message": "callback received"
        })
    }
}

module.exports = WebhookController