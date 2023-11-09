const httpResponse = require('../helpers/httpResponse');
const DashboardService = require('../services/dashboard.service');

const DashboardController = {
    getDashboardInformation: async (req, res) => {
        const { startDate, endDate } = req.query;

        const start = new Date(parseInt(startDate ?? 0)).toISOString().slice(0, 10);
        const end = new Date(parseInt(endDate ?? 0)).toISOString().slice(0, 10);

        try {
            const dashboardDetail = await DashboardService.getDashboardInformation(start, end);
            res.json(dashboardDetail);
        } catch (err) {
            console.error('Error in DashboardController.getDashboardInformation:', err);
            res.status(500).send(err.message);
        }
    },

};


module.exports = DashboardController;