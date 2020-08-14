const BootcampDB = require('../models/bootcamps');

exports.getBootcamps = (req,res,next) => {
    res.status(200).json({success: true , message: 'Show all data bootcamps'});
}

exports.getBootcamp = (req,res,next) => {
    res.status(200).json({success: true , message: `Show data bootcamps by id ${req.params.id}`});
}

exports.createBootcamp = async (req,res,next) => {
   try {
       const bootcamp = await BootcampDB.create(req.body);

       res.status(201).json({
           success: true,
           data: bootcamp
       });
   }catch (e) {
       res.status(400).json({
           success: false,
       })
   }

}

exports.updateBootcamp = (req,res,next) => {
    res.status(200).json({success: true , message: `Update data bootcamps by id ${req.params.id}`});
}

exports.deleteBootcamp = (req,res,next) => {
    res.status(200).json({success: true , message: `Delete data bootcamps by id ${req.params.id}`});
}
