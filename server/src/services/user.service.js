const User = require('../model/user.model');

exports.getAllUsersService = async () => {
    const users = await User.find().select('-password -otp -otpExpiry -refreshToken');
    return users;
};

exports.getUserProfileService = async (id) => {
    const user = await User.findById(id).select('-password -otp -otpExpiry -refreshToken');
    return user;
};

exports.updateUserProfileService = async (id, updateData) => {
    const { name, phone, address, interestedIn } = updateData;
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (phone !== undefined) updateFields.phone = phone;
    if (address !== undefined) updateFields.address = address;
    if (interestedIn !== undefined) updateFields.interestedIn = interestedIn;

    const user = await User.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true, runValidators: true }
    ).select('-password -otp -otpExpiry -refreshToken');
    return user;
};
