const jwt = require('jsonwebtoken');

const getTokenUserId = (request) => {
    const token = request.headers.authorization;
    const sanitized = token.split(' ')[1];
    const decoded = jwt.decode(sanitized);
    return decoded.id;
}

module.exports = getTokenUserId;