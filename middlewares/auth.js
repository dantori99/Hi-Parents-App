const { verifyToken } = require('../utils/jwt')

module.exports = {
    async loggedIn (req, res, next) {
        if (!req.headers.authorization) {
            return res.status(401).json({ statusCode: 401, message: 'please login first!'})
        }
        let token = req.headers.authorization.replace('Bearer ', '');

        let userData = verifyToken(token);
        req.userData = userData;

        next()
    }
}