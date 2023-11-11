const ConfigurationModel = require('../models/configuration.model');

const ConfigurationService = {
    getBroadcastConfig: async () => {
        try {
            const broadcastConfig = await ConfigurationModel.getBroadcastConfig();
            return broadcastConfig;
        } catch (err) {
            console.error('Error in QuestionService.getBroadcastConfig:', err);
            throw err;
        }
    },

    updateBroadcastConfig: async (newQuota, sentMsg) => {
        try {
            const broadcastConfig = await ConfigurationModel.updateBroadcastConfig(newQuota, sentMsg);
            return broadcastConfig;
        } catch (err) {
            console.error('Error in QuestionService.updateBroadcastConfig:', err);
            throw err;
        }
    }

};

module.exports = ConfigurationService;