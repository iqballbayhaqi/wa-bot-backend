const TicketModel = require('../models/ticket.model');

const DashboardService = {
    getDashboardInformation: async () => {
        try {
            const dashboardInformation = await TicketModel.getDashboardInformation();
            return dashboardInformation;
        } catch (err) {
            console.error('Error in DashboardService.getDashboardInformation', err);
            throw err;
        }
    },

};

module.exports = DashboardService;