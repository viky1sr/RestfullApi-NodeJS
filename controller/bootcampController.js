exports.getBootcamps = (req,res,next) => {
    res.status(200).json({success: true , message: 'Show all data bootcamps'});
}
exports.getBootcamp = (req,res,next) => {
    res.status(200).json({success: true , message: `Show data bootcamps by id ${req.params.id}`});
}
exports.createBootcamp = (req,res,next) => {
    res.status(200).json({success: true , message: 'Created data bootcamps'});
}
exports.updateBootcamp = (req,res,next) => {
    res.status(200).json({success: true , message: `Update data bootcamps by id ${req.params.id}`});
}
exports.deleteBootcamp = (req,res,next) => {
    res.status(200).json({success: true , message: `Delete data bootcamps by id ${req.params.id}`});
}