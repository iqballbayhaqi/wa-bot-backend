const jwt = require('jsonwebtoken');
const role = require('../helpers/role');
const httpResponse = require('../helpers/httpResponse');

function verifyAgentToken(allowedRoles) {
    return function (req, res, next) {
        let token = req.headers.authorization;
        if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

        token = token.replace('Bearer ', '');

        jwt.verify(token, process.env.PUBLIC_JWT_SECRET, function (err, decoded) {
            if (err) {
                return httpResponse.unauthorized(res, "Unauthorized");
            }
            if (!allowedRoles.includes(decoded.role)) {
                return httpResponse.notallowed(res, 'Role not allowed');
            }
            req.userId = decoded.id;
            next();
        });
    }
}

module.exports = verifyAgentToken; 