const fs = require('fs')
const catchAsync = require('../utils/catchAsync')
const User = require('../models/userModels')

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find()
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users,
        },
    })
})

exports.updateProfile = catchAsync(async (req, res, next) => {
    const updateUser = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
        runValidators: true,
    })
    res.status(200).json({
        status: 'success',
        data: {
            user: updateUser,
        },
    })
})

exports.deleteProfile = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false })

    res.status(204).json({
        status: 'success',
        data: null,
    })
})

exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    })
}
exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    })
}
exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    })
}
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    })
}
