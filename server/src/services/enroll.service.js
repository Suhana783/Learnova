const Enroll = require('../model/enroll.model');

const enrollUserService = async (userId, courseId) => {

    const enroll = await Enroll.create({
        userId,
        courseId,
    });

    return enroll;
};

const getMyEnrollmentService = async (userId) => {

    const enrollments = await Enroll.find({ userId });

    return enrollments;
};

module.exports = {
    enrollUserService,
    getMyEnrollmentService,
};