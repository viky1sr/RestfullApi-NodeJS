const CoursesDB = require('../models/course');
const ErrorResponse = require('../middleware/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const gecoder = require('../partial/geocoder');

exports.getCourses = asyncHandler(async (req, res, next) =>{
    let query;

    if(req.params.bootcampId) {
        query = CoursesDB.find({bootcamp: req.params.bootcampId})
    } else {
        query = CoursesDB.find();
    }

    const course = await query;

    res.status(200).json({
        success: true,
        count: course.length,
        data: course
    });
})