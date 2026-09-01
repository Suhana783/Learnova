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
            fileUrl: req.file.path,
            fileType: req.body.fileType,
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

        const assignments = await getAssignmentsService();

        res.status(200).json({
            success: true,
            data: assignments,
        });

    } catch (error) {
        error.statusCode = error.statusCode || 400;
        next(error);
    }
};