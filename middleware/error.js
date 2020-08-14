const ErrorResponse = require('../middleware/errorResponse')

const errorHandler = (err, req , res, next) => {
    let error = {...err}

    error.message = err.message;

    console.log(err.stack.red);

    // Mongoose bad ObjectId
    if(err === 'CastError') {
        const message = `Resource not found with id of ${req.params.id}`;
        error = new ErrorResponse(message,404)
    }

    // Mongoose duplicate key
    if(err.code === 11000) {
        const message = 'Duplicate field value entered'
        error = new ErrorResponse(message,404)
    }

    // Mongoose Validation error
    if(err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(value => value.message);
        error = new ErrorResponse(message,404)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server error'
    })
}

module.exports = errorHandler;