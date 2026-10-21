module.exports = (err, req, res, next) => {
    if (err?.code === 11000 || (err?.message && err.message.includes('E11000'))) {
        return res.status(409).json({
            success: false,
            message: 'This email is already registered. Please log in.',
        });
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal server error',
    });
};
