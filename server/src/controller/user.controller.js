const {
    getAllUsersService,
    deleteUserService,
    getUserProfileService,
    updateUserProfileService,
} = require('../services/user.service');

exports.getProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await getUserProfileService(userId);
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        error.statusCode = error.statusCode || 400;
        next(error);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const updated = await updateUserProfileService(userId, req.body);
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updated,
        });
    } catch (error) {
        error.statusCode = error.statusCode || 400;
        next(error);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await getAllUsersService();
        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        error.statusCode = error.statusCode || 400;
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const deleted = await deleteUserService(req.params.id);
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: deleted,
        });
    } catch (error) {
        error.statusCode = error.statusCode || 404;
        next(error);
    }
};