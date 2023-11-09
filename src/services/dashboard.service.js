const TicketModel = require('../models/ticket.model');

const DashboardService = {
    getDashboardInformation: async (startDate, endDate) => {
        try {
            const dashboardInformation = await TicketModel.getDashboardInformation(startDate, endDate);
            return dashboardInformation;
        } catch (err) {
            console.error('Error in DashboardService.getDashboardInformation', err);
            throw err;
        }
    },

};

module.exports = DashboardService;