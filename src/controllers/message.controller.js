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
            const { title, msg, type, selected } = req.body;

            if (title == null | msg == null || type == null || selected == null) {
                return httpResponse.badrequest(res, "One or more required fields are missing");
            }

            await BroadcastService.createBroadcast(title, msg, type, selected)

            return httpResponse.success(res, { message: 'Message broadcasted' });
        } catch (err) {
            console.log(err)
            return httpResponse.error(res, "Internal Server Error");
        }
    },

    getBroadcasts: async (req, res) => {
        try {
            const broadcasts = await BroadcastService.getAllBroadcast();
            return httpResponse.success(res, broadcasts);
        } catch (err) {
            return httpResponse.error(res, "Internal Server Error")
        }
    },

    getBroadcastDetail: async (req, res) => {
        try {
            const { id } = req.params;

            if (isNaN(Number(id))) {
                return httpResponse.badrequest(res, "Invalid id");
            }

            const broadcast = await BroadcastService.getBroadcastDetail(id);

            if (broadcast == null) {
                return httpResponse.notfound(res, "Broadcast not found")
            }

            return httpResponse.success(res, broadcast);
        } catch (err) {
            return httpResponse.error(res, "Internal Server Error")
        }
    }
}

module.exports = MessageController;