const {
    getAllUsersService,
    deleteUserService,
} = require('../services/user.service');

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