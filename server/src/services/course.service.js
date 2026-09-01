const Course = require('../model/course.model');

const createCourseService = async (courseData) => {
    const newCourse = await Course.create(courseData)
    return newCourse;
};


const updateCourseService = async (courseId, updateData) => {

    const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        updateData,
        { new: true }
    );

    return updatedCourse;
};


const getAllCourseService = async (queryParams) => {
   
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const skip = (page - 1) * limit;

    
    let filter = {};

    
    if (queryParams.search) {
        filter.name = { $regex: queryParams.search, $options: 'i' };
    }

   
    if (queryParams.instructor) {
        filter.instructor = queryParams.instructor;
    }

    
    let sortBy = {};
    if (queryParams.sort) {
        if (queryParams.sort === 'latest') {
            sortBy.createdAt = -1;
        } else if (queryParams.sort === 'oldest') {
            sortBy.createdAt = 1;
        }
    }

    
    const totalCourses = await Course.countDocuments(filter);

   
    const courses = await Course.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit);

    return {
        courses,
        currentPage: page,
        totalPages: Math.ceil(totalCourses / limit),
        totalCourses,
        coursesOnThisPage: courses.length,
    };
};


const getCourseService = async (ID) => {
    const course = await Course.findById(ID);
    return course;
};


const deleteCourseService = async (deleteCourse) => {

    const deleteCourseById = await Course.findByIdAndDelete(deleteCourse);
    return deleteCourseById;
};

module.exports = {
    createCourseService,
    updateCourseService,
    getAllCourseService,
    getCourseService,
    deleteCourseService,
};