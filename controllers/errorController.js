const AppError = require('../utils/appError')

const handleCastError = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

const handleDuplicateError = (err) => {
    const message = `Duplicate field value ${err.keyValue.name}.Please use another value.`
    return new AppError(message, 400)
}
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
        console.log('Error', err)
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
        if (error.code === 11000) error = handleDuplicateError(error)
        sendErrorProd(error, res)
    }
}
