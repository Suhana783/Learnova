const Assignment = require('../model/assignment.model');

const uploadAssignmentService = async (assignmentData) => {

    const assignment = await Assignment.create(assignmentData);

    return assignment;
};

const getAssignmentsService = async (filter = {}) => {
    const assignments = await Assignment.find(filter).sort({ createdAt: -1 });
    return assignments;
};

module.exports = {
    uploadAssignmentService,
    getAssignmentsService,
};