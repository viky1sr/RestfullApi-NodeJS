const BootcampDB = require('../models/bootcamps');
const ErrorResponse = require('../middleware/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const gecoder = require('../partial/geocoder');
const path = require('path');

exports.getBootcamps = asyncHandler(async (req,res,next) => {
        res.status(201).json(res.advanceResults);
});

exports.getBootcamp = asyncHandler(async (req,res,next) => {
    const bootcamp = await BootcampDB.findById(req.params.id);
    res.status(201).json({
        success: true,
        data: bootcamp
    });

});

exports.createBootcamp = asyncHandler(async (req,res,next) => {
       const bootcamp = await BootcampDB.create(req.body);

       res.status(201).json({
           success: true,
           data: bootcamp
       });

});

exports.updateBootcamp = asyncHandler(async (req,res,next) => {
        const bootcamp = await BootcampDB.findByIdAndUpdate(req.params.id,req.body, {
            new: true,
            runValidation: true
        });

        if (!bootcamp) {
            next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }

        res.status(201).json({
            success: true,
            data: bootcamp
        });
});

exports.deleteBootcamp = asyncHandler(async (req,res,next) => {
        const bootcamp = await BootcampDB.findById(req.params.id);

        if (!bootcamp) {
            next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }

        bootcamp.remove();

        res.status(201).json({
            success: true,
            data: {}
        });
});

exports.getBootcampRadius = asyncHandler(async (req,res,next) => {
   const {zipcode, distance} = req.params;

   // get lat or lng from geocoder
   const loc = await gecoder.geocode(zipcode);
   const lat = loc[0].latitude;
   const lng = loc[0].longitude;

   const radius = distance / 3963;

   const bootcamps = await BootcampDB.find({
      location: { $geoWithin: { $centerSphere: [[ lng , lat], radius]}}
   });

   res.status(200).json({
       success: true,
       count: bootcamps.length,
       data: bootcamps
   });

});

exports.uploadPhotoBootcamp = asyncHandler(async (req,res,next) => {
    const bootcamp = await BootcampDB.findById(req.params.id);

    if (!bootcamp) {
        next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    if(!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 404));
    }

    // console.log(req.files);
    const file = req.files.file;

    //Validation
    if(!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload image file`, 404));
    }

    if(file.size < process.env.MAX_FILE_UPOAD) {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPOAD}`, 400))
    }

    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err) {
            console.error(err)
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        await BootcampDB.findByIdAndUpdate(req.params.id, {photo: file.name});

        res.status(200).json({
            success: true,
            data: file.name
        });
    });
    console.log(file.name)
});