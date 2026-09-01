const jwt = require('jsonwebtoken');
const { accessTokenSecret, refreshTokenSecret } = require('../src/config/secrets');

const createAccessToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            email: user.email,
            role: user.role,
        },
        accessTokenSecret,
        { expiresIn: '40m' }
    );
};

const createRefreshToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            email: user.email,
        },
        refreshTokenSecret,
        { expiresIn: '7d' }
    );
};

module.exports = {
    createAccessToken,
    createRefreshToken,
};