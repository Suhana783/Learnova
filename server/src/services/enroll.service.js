const Enroll = require('../model/enroll.model');

const enrollUserService = async (userId, courseId) => {
    const existingEnrollment = await Enroll.findOne({ userId, courseId });
    if (existingEnrollment) return existingEnrollment;

    return Enroll.create({
        userId,
        courseId,
    });
};

const getMyEnrollmentService = async (userId) => {

    const enrollments = await Enroll.find({ userId });

    return enrollments;
};

module.exports = {
    enrollUserService,
    getMyEnrollmentService,
};
