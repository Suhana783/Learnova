const {
    createCourseService,
    updateCourseService,
    getAllCourseService,
    getCourseService,
    deleteCourseService
} = require('../services/course.service.js')


exports.createCourse = async (req, res, next) => {
    try {
        const course = await createCourseService(req.body);
        res.status(201).json({
            success: true,
            message: "course is created successfully",
            data: course
        })
    } catch (error) {
        error.statusCode = error.statusCode || 400;
        next(error);
    }
};

exports.updateCourse = async (req, res, next) => {
    try {
        const update = await updateCourseService(req.params.id, req.body)
        res.status(200).json({
            success: true,
            message: "updated successfully",
            data: update
        })
    } catch (error) {
        error.statusCode = error.statusCode || 404;
        next(error);
    }
};


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

exports.deleteCourse = async (req, res, next) => {
    try {
        const deleteCourseById = await deleteCourseService(req.params.id)
        res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        })
    } catch (error) {
        error.statusCode = error.statusCode || 404;
        next(error);
    }
};