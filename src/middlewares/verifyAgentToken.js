const jwt = require('jsonwebtoken');
const role = require('../helpers/role');

function verifyAgentToken(req, res, next) {
    // log the origins of the request
    console.log(req.headers.origin)
    let token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    token = token.split(' ')[1];

    jwt.verify(token, process.env.PUBLIC_JWT_SECRET, (err, decoded) => {
        const isAuthorized = decoded.role === role.AGENT || decoded.role === role.SUPER_ADMIN

        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        if (!isAuthorized) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = decoded;
        next();
    });
}

module.exports = verifyAgentToken; 