const {
   
    enrollUserService,
    getMyEnrollmentService
} = require('../services/enroll.service.js')

exports.userEnrolled = async (req, res, next) => {
  
    try {
        const enrollUser = await enrollUserService(req.user.id, req.params.courseId)
        res.status(201).json({
            success: true,
            message: "User enrolled successfully",
            data: enrollUser
        })
    } catch(error) {
        error.statusCode = error.statusCode || 400;
        next(error);
    } 
}

exports.getAllEnrollments = async (req, res, next) => {
      try {
        const allEnrollments = await getMyEnrollmentService(req.user.id)
        res.status(200).json({
        success: true,
        message: "All enrollments",
        data: allEnrollments
      })

      } catch (error) {
        error.statusCode = error.statusCode || 400;
        next(error);
      }
}