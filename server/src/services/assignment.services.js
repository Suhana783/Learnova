const Assignment = require('../model/assignment.model');

const uploadAssignmentService = async (assignmentData) => {

    const assignment = await Assignment.create(assignmentData);

    return assignment;
};

const getAssignmentsService = async () => {

    const assignments = await Assignment.find();

    return assignments;
};

module.exports = {
    uploadAssignmentService,
    getAssignmentsService,
};