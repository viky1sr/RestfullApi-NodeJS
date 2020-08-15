const CoursesDB = require('../models/course');
const BootcampDB = require('../models/bootcamps');
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
});

exports.getCourse = asyncHandler(async (req, res, next) =>{
   const course = await CoursesDB.findById(req.params.id).populate({
      path: 'bootcamp',
      select: 'name description'
   });

   if(!course) {
       return next(
         new ErrorResponse(`No Courses with id of ${req.params.id}`),
           404
       );
   }

    res.status(200).json({
        success: true,
        count: course.length,
        data: course
    });
});

// @route POST /api/v1/bootcamps/:bootcampId/courses
exports.addCourse = asyncHandler(async (req, res, next) =>{
    req.body.bootcamp = req.params.bootcampId;

    const bootcamp = await BootcampDB.findById(req.params.bootcampId);

    if(!bootcamp) {
        return next(
            new ErrorResponse(`No bootcamp with id of ${req.params.bootcampId}`),
            404
        );
    }

    const course = await CoursesDB.create(req.body);

    res.status(200).json({
        success: true,
        data: course
    });
});