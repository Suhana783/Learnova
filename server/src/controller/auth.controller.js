
const {
    registerUserService,
    verifyOTPService,
    loginUserService,
    refreshTokenService,
} = require('../services/auth.service');

exports.registerUser = async (req, res, next) => {
    try {
        const result = await registerUserService(req.body);
        res.status(201).json({success: true, message: result.message, userId: result.userId});
    } catch (error) {
        error.statusCode = error.statusCode || 400;
        next(error);
    }
};

exports.verifyOTP = async (req, res, next) => {
    try {
        const result = await verifyOTPService(req.body);
        res.status(200).json({success: true, message: result.message});
    } catch (error) {
        error.statusCode = error.statusCode || 400;
        next(error);
    }
};

exports.loginUser = async (req, res, next) => {
    try {
        const result = await loginUserService(req.body);
        res.status(200).json({success: true, ...result});
    } catch (error) {
        error.statusCode = error.statusCode || 400;
        next(error);
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const result = await refreshTokenService(req.body);
        res.status(200).json({success: true, ...result});
    } catch (error) {
        error.statusCode = error.statusCode || 400;
        next(error);
    }
};