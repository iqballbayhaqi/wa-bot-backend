const httpResponse = require('../helpers/httpResponse');
const MessageService = require('../services/message.service')

const MessageController = {
    sendMessage: async (req, res) => {
        try {
            const { to, from, body, StatusCallback } = req.body;

            await MessageService.sendMessage(to, from, body, StatusCallback);

            return httpResponse.success(res, { message: 'Message sent' });
        } catch (err) {
            console.log(err)
            return httpResponse.error(res, "Internal Server Error");
        }
    }
}


module.exports = MessageController;