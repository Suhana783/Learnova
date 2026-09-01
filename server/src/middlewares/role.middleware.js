
const roleBasedAccess = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                const err = new Error('User not found');
                err.statusCode = 401;
                return next(err);
            }

            if (!allowedRoles.includes(req.user.role)) {
                const err = new Error('Access denied: Insufficient permissions');
                err.statusCode = 403;
                return next(err);
            }

            next();
        } catch (error) {
            error.statusCode = error.statusCode || 500;
            next(error);
        }
    };
};

module.exports = roleBasedAccess;