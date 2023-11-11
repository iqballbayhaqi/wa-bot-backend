
const httpResponse = {
    success: (res, data) => {
        return res.status(200).json({
            status: 'success',
            data,
        });
    },

    created: (res, message) => {
        return res.status(201).json({
            status: 'success',
            message,
        });
    },

    notfound: (res, message) => {
        return res.status(404).json({
            status: 'error',
            message,
        });
    },

    badrequest: (res, message) => {
        return res.status(400).json({
            status: 'error',
            message,
        });
    },

    unauthorized: (res, message) => {
        return res.status(401).json({
            status: 'error',
            message,
        });
    },

    error: (res, message = "Internal Server Error") => {
        return res.status(500).json({
            status: 'error',
            message,
        });
    },

    //add conflict
    conflict: (res, message) => {
        return res.status(409).json({
            status: 'error',
            message,
        });
    },

    notallowed: (res, message) => {
        return res.status(403).json({
            status: 'error',
            message,
        });
    },
}

module.exports = httpResponse;