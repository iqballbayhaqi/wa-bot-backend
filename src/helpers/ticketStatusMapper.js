const mapDashboardInfo = async (data) => {
    const result = data.reduce((acc, item) => {
        const { department, status, numberOfTickets } = item;

        if (!acc[department]) {
            acc[department] = {
                departmentId: department,
                status: {
                    pending: 0,
                    open: 0,
                    closed: 0
                }
            };
        }

        if (status === 'PENDING') {
            acc[department].status.pending += numberOfTickets;
        } else if (status === 'OPEN') {
            acc[department].status.open += numberOfTickets;
        } else if (status === 'CLOSED') {
            acc[department].status.closed += numberOfTickets;
        }

        return acc;
    }, {});

    return Object.values(result);;
};

module.exports = mapDashboardInfo