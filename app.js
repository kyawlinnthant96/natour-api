const express = require('express')
const morgan = require('morgan')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongosanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()
// Security http header
app.use(helmet())

// development logging
app.use(morgan('dev'))

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, please try again in an hour',
})
app.use('/api', limiter)
app.use(express.json())

// data sanitization nosql queries
app.use(mongosanitize())
// data sanitize html injection
app.use(xss())
// Prevent parameter pollution
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price',
        ],
    })
)

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
})

app.use(globalErrorHandler)

module.exports = app
