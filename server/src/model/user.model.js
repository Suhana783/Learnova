const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },


        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ['user', 'admin'],
            lowercase: true,
            required: true
        },

        otp: {
            type: String,
        },

        otpExpiry: {
            type: Date,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        refreshToken: {
            type: String,
        },
    }, {
       
        timestamps: true,
    }
)

const Users = mongoose.model("Users", userSchema)
module.exports = Users