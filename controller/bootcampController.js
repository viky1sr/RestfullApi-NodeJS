const BootcampDB = require('../models/bootcamps');

exports.getBootcamps = async (req,res,next) => {
    try {
        const bootcamp = await BootcampDB.find();

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

exports.getBootcamp = async (req,res,next) => {
    try {
        const bootcamp = await BootcampDB.findById(req.params.id);

        if (!bootcamp) {
            res.status(400).json({
                success: false,
                message: 'Bootcamp not found'
            })
        }

        res.status(201).json({
            success: true,
            data: bootcamp
        });

    }catch (e) {
      next(e);
    }
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

exports.updateBootcamp = async (req,res,next) => {
    try {
        const bootcamp = await BootcampDB.findByIdAndUpdate(req.params.id,req.body);

        if (!bootcamp) {
            res.status(400).json({
                success: false,
                message: 'Bootcamp not found'
            })
        }

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

exports.deleteBootcamp = async (req,res,next) => {
    try {
        const bootcamp = await BootcampDB.findByIdAndDelete(req.params.id,req.body);

        if (!bootcamp) {
            res.status(400).json({
                success: false,
                message: 'Bootcamp not found'
            })
        }

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
