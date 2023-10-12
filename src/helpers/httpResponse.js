
const httpResponse = {
    success: (res, data) => {
        res.status(200).json({
            status: 'success',
            data,
        });
    },

    created: (res, message) => {
        res.status(201).json({
            status: 'success',
            message,
        });
    },

    notfound: (res, message) => {
        res.status(404).json({
            status: 'error',
            message,
        });
    },

    badrequest: (res, message) => {
        res.status(400).json({
            status: 'error',
            message,
        });
    },

    unauthorized: (res, message) => {
        res.status(401).json({
            status: 'error',
            message,
        });
    },

    error: (res, message = "Internal Server Error") => {
        res.status(500).json({
            status: 'error',
            message,
        });
    },
}

module.exports = httpResponse;