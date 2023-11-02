const { valid } = require('joi');
const httpResponse = require('../helpers/httpResponse');
const MessageService = require('../services/message.service');
const BroadcastService = require('../services/broadcast.service');

const MessageController = {
    sendMessage: async (req, res) => {
        try {
            const { to, msg } = req.body;

            await MessageService.sendMessage(to, msg);
            await MessageService.selfMessageHandler({ to, msg })

            return httpResponse.success(res, { message: 'Message sent' });
        } catch (err) {
            console.log(err)
            return httpResponse.error(res, "Internal Server Error");
        }
    },

    broadcastMessage: async (req, res) => {
        try {
            const { msg, type, filter } = req.body;

            if (msg == null || type == null) {
                return httpResponse.badrequest(res, "One or more required fields are missing");
            }

            await BroadcastService.createBroadcast(msg, type, filter)

            return httpResponse.success(res, { message: 'Message broadcasted' });
        } catch (err) {
            console.log(err)
            return httpResponse.error(res, "Internal Server Error");
        }
    }
}


module.exports = MessageController;