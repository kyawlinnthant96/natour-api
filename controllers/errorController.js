const AppError = require('../utils/appError')

const handleCastError = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

const handleDuplicateFieldDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
    console.log(value)
    const message = `Duplicate field value ${err.keyValue.name}.Please use another value.`
    return new AppError(message, 400)
}

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message)
    const message = `Invalid input data. ${errors.join('. ')}`
    return new AppError(message, 400)
}
const handelJWTError = () =>
    new AppError('Invalid token, Please login again', 401)
const handleJWTExpireError = () =>
    new AppError('Token Expire, Please login again', 401)
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    })
}

const sendErrorProd = (err, res) => {
    // operation trusted error send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
        // programming or other error: dont leak error detail
    } else {
        // log error
        console.error('ERROR 💥', err)
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
        })
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err }
        if (error.name === 'CastError') error = handleCastError(error)
        if (error.code === 11000) error = handleDuplicateFieldDB(error)
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error)
        if (error.name === 'JsonWebTokenError') error = handelJWTError()
        if (error.name === 'TokenExpiredError') error = handleJWTExpireError()

        sendErrorProd(error, res)
    }
}
