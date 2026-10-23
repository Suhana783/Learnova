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
            user: req.user._id,
            studentName: req.user.name,
            studentEmail: req.user.email,
            status: 'Submitted',
        });

        res.status(201).json({
            success: true,
            message: 'Assignment uploaded successfully',
            data: assignment,
        });

    } catch (error) {
        error.statusCode = error.statusCode || 400;
        next(error);
    }
};

exports.getAssignments = async (req, res, next) => {
    try {
        const assignments = await getAssignmentsService({
            $or: [{ user: req.user._id }, { studentEmail: req.user.email }],
        });

        res.status(200).json({
            success: true,
            data: assignments,
        });

    } catch (error) {
        error.statusCode = error.statusCode || 400;
        next(error);
    }
};
