const httpResponse = require('../helpers/httpResponse');
const DashboardService = require('../services/dashboard.service');

const DashboardController = {
    getDashboardInformation: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;

            const start = startDate ? new Date(parseInt(startDate)).toISOString().slice(0, 10) : null;
            const end = endDate ? new Date(parseInt(endDate)).toISOString().slice(0, 10) : null;

            if (!start || !end) {
                throw new Error('Invalid start or end date');
            }

            const dashboardDetail = await DashboardService.getDashboardInformation(start, end);
            res.json(dashboardDetail);
        } catch (err) {
            console.error('Error in DashboardController.getDashboardInformation:', err);
            res.status(500).send(err.message);
        }
    },

};


module.exports = DashboardController;