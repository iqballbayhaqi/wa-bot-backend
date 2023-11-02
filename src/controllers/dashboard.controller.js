const httpResponse = require('../helpers/httpResponse');
const DashboardService = require('../services/dashboard.service');

const DashboardController = {
    getDashboardInformation: async (req, res) => {
        try {
            const dashboardDetail = await DashboardService.getDashboardInformation();
            res.json(dashboardDetail);
        } catch (err) {
            console.error('Error in DashboardController.getDashboardInformation:', err);
            res.status(500).send(err.message);
        }
    },

};


module.exports = DashboardController;