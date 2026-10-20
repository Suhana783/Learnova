const mongoose = require('mongoose');
const Course = require('../model/course.model');

const createCourseService = async (courseData) => {
    // If slug is not provided, automatically generate a clean URL-friendly slug from title
    if (!courseData.slug && courseData.title) {
        courseData.slug = courseData.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    }
    const newCourse = await Course.create(courseData);
    return newCourse;
};

// Helper to resolve a course strictly by ID (or slug)
const resolveCourse = async (courseId) => {
    if (!courseId) {
        const error = new Error('Course ID is required');
        error.statusCode = 400;
        throw error;
    }

    let course;
    if (mongoose.Types.ObjectId.isValid(courseId)) {
        course = await Course.findById(courseId);
    }
    if (!course) {
        course = await Course.findOne({ slug: courseId });
    }

    if (!course) {
        const error = new Error('Course not found with the provided ID');
        error.statusCode = 404;
        throw error;
    }
    return course;
};

// PUT - Whole course update
const updateCourseService = async (courseId, updateData = {}) => {
    const course = await resolveCourse(courseId);

    const payload = { ...updateData };
    delete payload._id;
    delete payload.id;
    delete payload.courseId;
    delete payload.createdAt;
    delete payload.updatedAt;
    delete payload.__v;

    // Automatically regenerate slug if title is updated and slug is not provided
    if (payload.title && !payload.slug) {
        payload.slug = payload.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    }

    const updatedCourse = await Course.findByIdAndUpdate(
        course._id,
        payload,
        { new: true, runValidators: true }
    );
    return updatedCourse;
};

// PATCH - Partial course update
const patchCourseService = async (courseId, patchData = {}) => {
    const course = await resolveCourse(courseId);

    const payload = { ...patchData };
    delete payload._id;
    delete payload.id;
    delete payload.courseId;
    delete payload.createdAt;
    delete payload.updatedAt;
    delete payload.__v;

    // Automatically regenerate slug if title is updated and slug is not provided
    if (payload.title && !payload.slug) {
        payload.slug = payload.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    }

    const patchedCourse = await Course.findByIdAndUpdate(
        course._id,
        { $set: payload },
        { new: true, runValidators: true }
    );
    return patchedCourse;
};

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

const deleteCourseService = async (deleteCourse) => {
    const deleteCourseById = await Course.findByIdAndDelete(deleteCourse);
    return deleteCourseById;
};

module.exports = {
    createCourseService,
    updateCourseService,
    patchCourseService,
    updateWholeCourseService: updateCourseService,
    partialUpdateCourseService: patchCourseService,
    getAllCourseService,
    getCourseService,
    deleteCourseService,
};