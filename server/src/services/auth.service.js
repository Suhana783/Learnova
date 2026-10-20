const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/user.model');
const sendOTPEmail = require('../../utils/sendEmail');
const { createAccessToken, createRefreshToken } = require('../../utils/token');
const { refreshTokenSecret } = require('../config/secrets');

const registerUserService = async (userData) => {
    const { name, email, password, phone, address, interestedIn, role = 'user' } = userData;

    const existingUser = await User.findOne({ email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 18 * 60 * 1000;
    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    if (existingUser) {
        if (existingUser.isVerified) {
            throw new Error('Email already registered. Please log in.');
        }
        // If pending verification, update info and send new OTP
        existingUser.name = name;
        existingUser.password = hashedPassword;
        existingUser.phone = phone || existingUser.phone;
        existingUser.address = address || existingUser.address;
        existingUser.interestedIn = interestedIn || existingUser.interestedIn;
        existingUser.role = role || existingUser.role;
        existingUser.otp = otp;
        existingUser.otpExpiry = otpExpiry;
        user = await existingUser.save();
    } else {
        user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            interestedIn,
            role: role || 'user',
            otp,
            otpExpiry,
        });
    }

    await sendOTPEmail(email, otp);

    return {
        message: 'OTP sent to your email address',
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
            phone: user.phone || '',
            address: user.address || '',
            interestedIn: user.interestedIn || '',
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

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    user.refreshToken = refreshToken;

    await user.save();

    return {
        message: 'Registration verified and account created successfully',
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            address: user.address || '',
            interestedIn: user.interestedIn || '',
            role: user.role,
        },
    };
};

module.exports = {
    registerUserService,
    verifyOTPService,
    loginUserService,
    refreshTokenService,
};
