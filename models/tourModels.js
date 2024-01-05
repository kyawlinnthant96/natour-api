const mongoose = require('mongoose')
const validator = require('validator')

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true, // remove white space of input
            maxLength: [
                40,
                'A tour name must have less or equal then 40 characters',
            ],
            minLength: [
                10,
                'A tour name must have more or equal then 10 characters',
            ],
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, 'A tour must hava a duration'],
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size'],
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty is either: easy, medium, difficult',
            },
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0'],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price'],
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    return val < this.price
                },
                message:
                    'Discount price ({VALUE}) should be below regular price',
            },
        },
        summary: {
            type: String,
        },
        description: {
            type: String,
        },
        imageCover: {
            type: String,
        },
        images: [String],
        cratedAt: {
            type: Date,
        },
        secretTour: {
            type: Boolean,
            default: false,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

const Tour = mongoose.model('Tour', tourSchema)
module.exports = Tour
