const {
    uploadAssignmentService,
    getAssignmentsService,
} = require('../services/assignment.services');

exports.uploadAssignment = async (req, res, next) => {
    try {
        if (!req.file) {
            const error = new Error('File is required');
            error.statusCode = 400;
            throw error;
        }

        const assignment = await uploadAssignmentService({
            title: req.body.title || req.file.originalname || 'Assignment',
            description: req.body.description || '',
            fileUrl: req.file.path,
            fileType: req.body.fileType || req.file.mimetype || 'document',
            user: (req.user && req.user._id) || (req.body.userId && req.body.userId.match(/^[0-9a-fA-F]{24}$/) ? req.body.userId : undefined),
            studentName: (req.user && req.user.name) || req.body.studentName || '',
            studentEmail: (req.user && req.user.email) || req.body.studentEmail || '',
            status: 'Submitted',
        });

        res.status(201).json({
            success: true,
            message: 'Assignment uploaded successfully',
            data: assignment,
        });

    } catch (error) {
        console.log(error);
        error.statusCode = error.statusCode || 400;
        next(error);
    }
};

exports.getAssignments = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.studentEmail) {
            filter.studentEmail = req.query.studentEmail;
        } else if (req.query.userId && req.query.userId.match(/^[0-9a-fA-F]{24}$/)) {
            filter.user = req.query.userId;
        }

        const assignments = await getAssignmentsService(filter);

        res.status(200).json({
            success: true,
            data: assignments,
        });

    } catch (error) {
        error.statusCode = error.statusCode || 400;
        next(error);
    }
};