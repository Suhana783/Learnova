const jwt = require('jsonwebtoken');
const User = require('../model/user.model');
const { accessTokenSecret } = require('../config/secrets');

const authMiddleware = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const err = new Error('Token not provided');
            err.statusCode = 401;
            return next(err);
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, accessTokenSecret);

        const user = await User.findById(decoded.userId);

        if (!user) {
            const err = new Error('User not found');
            err.statusCode = 404;
            return next(err);
        }

        req.user = user;

        next();

    } catch (error) {
        error.statusCode = error.statusCode || 401;
        next(new Error('Invalid token'));
    }
};

module.exports = authMiddleware;