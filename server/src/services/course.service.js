const mongoose = require('mongoose');
const Course = require('../model/course.model');

const getAllCourseService = async (queryParams) => {
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = {};

    // Search matching title, shortDescription, description, or category
    if (queryParams.search) {
        const regex = { $regex: queryParams.search, $options: 'i' };
        filter.$or = [
            { title: regex },
            { shortDescription: regex },
            { description: regex },
            { category: regex },
        ];
    }

    if (queryParams.category && queryParams.category !== 'All') {
        filter.category = { $regex: queryParams.category, $options: 'i' };
    }

    if (queryParams.level && queryParams.level !== 'All') {
        filter.level = queryParams.level;
    }

    if (queryParams.instructor) {
        filter['instructor.name'] = { $regex: queryParams.instructor, $options: 'i' };
    }

    let sortBy = {};
    if (queryParams.sort) {
        if (queryParams.sort === 'latest') {
            sortBy.createdAt = -1;
        } else if (queryParams.sort === 'oldest') {
            sortBy.createdAt = 1;
        }
    } else {
        sortBy.createdAt = -1;
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

const getCourseService = async (idOrSlug) => {
    let course;
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
        course = await Course.findById(idOrSlug);
    }
    if (!course) {
        course = await Course.findOne({ slug: idOrSlug });
    }
    return course;
};

module.exports = {
    getAllCourseService,
    getCourseService,
};
