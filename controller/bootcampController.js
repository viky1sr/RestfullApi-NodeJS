const BootcampDB = require('../models/bootcamps');
const ErrorResponse = require('../middleware/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const gecoder = require('../partial/geocoder');

exports.getBootcamps = asyncHandler(async (req,res,next) => {
        const bootcamp = await BootcampDB.find();

        res.status(201).json({
            success: true,
            count: bootcamp.length,
            data: bootcamp
        });
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
        const bootcamp = await BootcampDB.findByIdAndDelete(req.params.id,req.body);

        if (!bootcamp) {
            next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }

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