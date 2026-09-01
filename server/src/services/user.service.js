const User = require('../model/user.model');

exports.getAllUsersService = async () => {
    const users = await User.find().select('-password -otp -otpExpiry -refreshToken');
    return users;
};

exports.deleteUserService = async (id) => {
    const user = await User.findByIdAndDelete(id);
    return user;
};
