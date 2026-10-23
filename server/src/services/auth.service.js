const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/user.model');
const sendOTPEmail = require('../../utils/sendEmail');
const { createAccessToken, createRefreshToken } = require('../../utils/token');
const { refreshTokenSecret } = require('../config/secrets');

const buildError = (message, statusCode = 400) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
};

const normalizeEmail = (email = '') => String(email).trim().toLowerCase();

const registerUserService = async (userData) => {
    const { name, email, password, phone, address, interestedIn, role = 'user' } = userData;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
        throw buildError('Email is required', 400);
    }

    // Step 1: Check whether the email already exists in MongoDB
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser && existingUser.isVerified) {
        throw buildError('This email is already registered. Please log in.', 409);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 18 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    let isNewUser = false;

    try {
        if (existingUser) {
            // Pending unverified account: refresh details + OTP for retry/resend flow
            existingUser.name = name;
            existingUser.password = hashedPassword;
            existingUser.phone = phone || existingUser.phone;
            existingUser.address = address || existingUser.address;
            existingUser.interestedIn = interestedIn || existingUser.interestedIn;
            existingUser.role = role || existingUser.role;
            existingUser.otp = otp;
            existingUser.otpExpiry = otpExpiry;
            existingUser.email = normalizedEmail;
            user = await existingUser.save();
        } else {
            isNewUser = true;
            user = await User.create({
                name,
                email: normalizedEmail,
                password: hashedPassword,
                phone,
                address,
                interestedIn,
                role: role || 'user',
                otp,
                otpExpiry,
                isVerified: false,
            });
        }
    } catch (dbError) {
        // Handles concurrent signup races safely without duplicate accounts
        if (dbError?.code === 11000 || (dbError?.message && dbError.message.includes('E11000'))) {
            const concurrentUser = await User.findOne({ email: normalizedEmail });
            if (concurrentUser && concurrentUser.isVerified) {
                throw buildError('This email is already registered. Please log in.', 409);
            }

            if (concurrentUser) {
                concurrentUser.name = name;
                concurrentUser.password = hashedPassword;
                concurrentUser.phone = phone || concurrentUser.phone;
                concurrentUser.address = address || concurrentUser.address;
                concurrentUser.interestedIn = interestedIn || concurrentUser.interestedIn;
                concurrentUser.role = role || concurrentUser.role;
                concurrentUser.otp = otp;
                concurrentUser.otpExpiry = otpExpiry;
                user = await concurrentUser.save();
            } else {
                throw buildError('This email is already registered. Please log in.', 409);
            }
        } else {
            throw dbError;
        }
    }

    // Step 2: Ensure email is accepted by provider before reporting success
    try {
        await sendOTPEmail(normalizedEmail, otp);
    } catch (emailError) {
        // Clean up newly created unverified account if email fails to send
        if (isNewUser && user?._id) {
            await User.findByIdAndDelete(user._id).catch(() => {});
        }
        throw emailError;
    }

    return {
        message: 'OTP sent to your email address',
        userId: user._id,
    };
};

const loginUserService = async ({email, password}) => {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !password) {
        throw buildError('Email and password are required', 400);
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) throw buildError('Invalid email or password', 401);
    if (!user.isVerified) throw buildError('Please verify your account first. Complete signup to verify your email.', 403);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw buildError('Invalid email or password', 401);
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
        throw buildError('Refresh token is required', 400);
    }

    const decoded = jwt.verify(refreshToken, refreshTokenSecret);
    const user = await User.findById(decoded.userId);

    if (!user) throw buildError('User not found', 404);
    if (user.refreshToken !== refreshToken) {
        throw buildError('Invalid refresh token', 401);
    }

    const newAccessToken = createAccessToken(user);

    return {
        message: 'Access token refreshed',
        accessToken: newAccessToken,
    };
};

const verifyOTPService = async ({email, otp}) => {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
        throw buildError('Email is required', 400);
    }
    if (!otp) {
        throw buildError('OTP code is required', 400);
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) throw buildError('User not found', 404);
    if (user.isVerified) throw buildError('This email is already registered and verified. Please log in.', 409);
    if (!user.otp || !user.otpExpiry) throw buildError('No OTP found. Please request a new OTP.', 400);

    if (Date.now() > new Date(user.otpExpiry).getTime()) {
        // OTP expired — delete the unverified user so the DB stays clean
        await User.findByIdAndDelete(user._id).catch(() => {});
        throw buildError('OTP has expired. Please sign up again to receive a new code.', 400);
    }

    if (String(user.otp).trim() !== String(otp).trim()) {
        // Wrong OTP — delete the unverified user so no ghost record lingers
        await User.findByIdAndDelete(user._id).catch(() => {});
        throw buildError('Invalid OTP code. Please sign up again with the correct code.', 400);
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
