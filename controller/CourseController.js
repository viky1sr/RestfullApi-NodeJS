const CoursesDB = require('../models/course');
const BootcampDB = require('../models/bootcamps');
const ErrorResponse = require('../middleware/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const gecoder = require('../partial/geocoder');

exports.getCourses = asyncHandler(async (req, res, next) =>{
    if(req.params.bootcampId) {
        const courses = await CoursesDB.find({bootcamp: req.params.bootcampId});

        return  res.status(200).json({
           success: true,
           count: courses.length,
            data: courses
        });
    } else {
        res.status(200).json(res.advanceResults);
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

exports.updateCourse = asyncHandler(async (req, res, next) =>{
    let course = await CoursesDB.findById(req.params.id);

    if(!course) {
        return next(
            new ErrorResponse(`No course with id of ${req.params.id}`),
            404
        );
    }

     course = await CoursesDB.findByIdAndUpdate(req.params.id,req.body, {
         new: true,
         runValidators: true
     });

    res.status(200).json({
        success: true,
        data: course
    });
});

exports.deleteCourse = asyncHandler(async (req, res, next) =>{
    const course = await CoursesDB.findById(req.params.id);

    if(!course) {
        return next(
            new ErrorResponse(`No course with id of ${req.params.id}`),
            404
        );
    }

    await course.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});