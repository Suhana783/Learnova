const {
    getAllCourseService,
    getCourseService,
} = require('../services/course.service.js')


exports.getAllCourses = async (req, res, next) => {
    try {
        const result = await getAllCourseService(req.query);
        res.status(200).json({
            success: true,
            message: "All courses here",
            currentPage: result.currentPage,
            totalPages: result.totalPages,
            totalCourses: result.totalCourses,
            coursesOnThisPage: result.coursesOnThisPage,
            data: result.courses,
        })
    } catch (error) {
        error.statusCode = error.statusCode || 404;
        next(error);
    }
};

exports.getCourse = async (req, res, next) => {
    try {
        const oneCourse = await getCourseService(req.params.id)
        res.status(200).json({
            success: true,
            data: oneCourse
        })
    } catch (error) {
        error.statusCode = error.statusCode || 404;
        next(error);
    }
};
