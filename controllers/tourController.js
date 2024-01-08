const fs = require('fs')
const Tour = require('../models/tourModels')
const APIFeatures = require('../utils/apiFeatures')
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
exports.aliasTopTour = async (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next()
}
exports.getAllTours = async (req, res) => {
    try {
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitedFields()
            .paginate()

        const tours = await features.query

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours,
            },
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        })
    }
}
exports.getTour = async (req, res) => {
    console.log(req.params.id)
    try {
        const tour = await Tour.findById(req.params.id)
        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message,
        })
    }
}

exports.createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1
    const newTour = Object.assign({ id: newId }, req.body)
    tours.push(newTour)
    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) =>
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour,
                },
            })
    )
}
exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        })
    } catch (e) {
        res.status(404).json({
            status: 'fail',
            message: e,
        })
    }
}

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null,
    })
}
