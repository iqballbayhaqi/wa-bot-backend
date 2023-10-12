const jwt = require('jsonwebtoken');
const role = require('../helpers/role');

function verifyToken(req, res, next) {
    let token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    token = token.split(' ')[1];

    jwt.verify(token, process.env.PUBLIC_JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        if (decoded.role !== role.AGENT) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = decoded;
        next();
    });
}

module.exports = verifyToken; 