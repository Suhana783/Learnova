const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/user.model');
const sendOTPEmail = require('../../utils/sendEmail');
const { createAccessToken, createRefreshToken } = require('../../utils/token');
const { refreshTokenSecret } = require('../config/secrets');

const registerUserService = async (userData) => {
    const {name, email, password, role} = userData;

    const existingUser = await User.findOne({email});

    if (existingUser) {
        throw new Error('Email already exists');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 18 * 60 * 1000; 
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        otp,
        otpExpiry,
    });

    await sendOTPEmail(email, otp);

    return {
        message: 'User created and OTP sent',
        userId: user._id,
    };
};

const loginUserService = async ({email, password}) => {
    const user = await User.findOne({email});

    if (!user) throw new Error('Invalid email or password');
    if (!user.isVerified) throw new Error('Please verify your account first');

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    return {
        message: 'Login successful',
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};

const refreshTokenService = async ({refreshToken}) => {
    if (!refreshToken) {
        throw new Error('Refresh token is required');
    }

    const decoded = jwt.verify(refreshToken, refreshTokenSecret);
    const user = await User.findById(decoded.userId);

    if (!user) throw new Error('User not found');
    if (user.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
    }

    const newAccessToken = createAccessToken(user);

    return {
        message: 'Access token refreshed',
        accessToken: newAccessToken,
    };
};

const verifyOTPService = async ({email, otp}) => {
    const user = await User.findOne({email});
    if (!user) throw new Error('User not found');
    if (user.isVerified) throw new Error('User already verified');
    if (!user.otp || !user.otpExpiry) throw new Error('No OTP found for user');

    if (Date.now() > new Date(user.otpExpiry).getTime()) {
        throw new Error('OTP expired');
    }

    if (user.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    return {message: 'User verified successfully'};
};

module.exports = {
    registerUserService,
    verifyOTPService,
    loginUserService,
    refreshTokenService,
};
