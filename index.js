const AppError = require('./appError');

//handle jsonWebTokenError
const handleExpiredError = () => new AppError('Token expired , please login again', 401)
const handleJwtError = () => new AppError('Invalid token , please login again', 401)


//Mongoose Errors
const handleCastErrorDB = err => {
    const message = `Invalid ${err.path} : ${err.value}`;
    return new AppError(message, 400)
}

const handleMongoErrorDB = (err) => {
    const value = err.errmsg.match(/"(.*?)"/)[0];
    const message = `Duplicate field value :  ${value}. please choose anothor value`
    return new AppError(message, 400)
}

const handleValidationErrorDB = (err) => {
    const { message } = err
    return new AppError(message, 400)
}


const sendErrorDevelopment = (err, req, res) => {

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        err: err,
        stack: err.stack
    })
}


const sendErrorProduction = (err, req, res) => {
    if (err.isOperational) {
        console.error('ERROR 💥', err)
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.messages
        })
    }
    //if not operational send a generic message without inforamation (third package libray errors , ....)
    console.error('ERROR 💥', err)
    res.status(500).json({
        status: 'Error',
        message: 'Somthing went wrong',
    });

}




module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDevelopment(err, req, res)
    }

    else if (process.env.NODE_ENV === 'production') {
        let error = { ...err }
        if (error.name === 'CastError') error = handleCastErrorDB(error)
        if (error.code === 11000) error = handleMongoErrorDB(error)
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error)
        if (error.name === 'JsonWebTokenError') error = handleJwtError()
        if (error.name === 'TokenExpiredError') error = handleExpiredError()

        sendErrorProduction(error, req, res)
    }
}
