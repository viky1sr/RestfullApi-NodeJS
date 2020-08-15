const BootcampDB = require('../models/bootcamps');
const ErrorResponse = require('../middleware/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const gecoder = require('../partial/geocoder');

exports.getBootcamps = asyncHandler(async (req,res,next) => {
       let query;
       // Copy req.query
       const reqQuery = {...req.query};

       //Fields to exclude
       const removeFields = ['select','sort','page','limit'];
       // Loop over removeFields and delet them from reqQuery
       removeFields.forEach(param => delete reqQuery[param]);

       // Create query string
       let queryStr = JSON.stringify(reqQuery);

       queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
       query = BootcampDB.find(JSON.parse(queryStr));

       // Select Fields
       if(req.query.select) {
           const fields = req.query.select.split(',').join(' ');
           query = query.select(fields);
       }

       // Sort
       if(req.query.sort) {
           const sortBy = req.query.sort.split(',').join(' ');
           query = query.sort(sortBy);
       }else {
           query = query.sort("-createdAt");
       }

       const page = parseInt(req.query.page, 10) || 1;
       const limit = parseInt(req.query.limit, 10) || 25;
       const startIndex = (page - 1) * limit;
       const endIndex = page * limit;
       const total = await BootcampDB.countDocuments();

       query = query.skip(startIndex).limit(limit);

       // Executing query
       const bootcamp = await  query;

       // Pagination result
       const paginations = {};

       if(endIndex < total) {
           paginations.next = {
               page: page + 1,
               limit
           }
       }

       if(startIndex > 0) {
           paginations.prev = {
               page: page - 1 ,
               limit
           }
       }

        res.status(201).json({
            success: true,
            count: bootcamp.length,
            paginations,
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