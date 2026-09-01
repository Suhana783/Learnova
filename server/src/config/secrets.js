
const accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'access_secret_dev';
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'refresh_secret_dev';

module.exports = {
    accessTokenSecret,
    refreshTokenSecret,
};
