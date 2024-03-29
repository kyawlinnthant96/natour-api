const express = require('express')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)

router.post('/forgot-password', authController.forgotPassword)
router.patch('/reset-password/:token', authController.resetPassword)
router.patch(
    '/update-password',
    authController.protect,
    authController.updatePassword
)
router.patch(
    '/update-profile',
    authController.protect,
    userController.updateProfile
)
router.delete(
    '/delete-profile',
    authController.protect,
    userController.deleteProfile
)

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser)
router
    .route('/:id')
    .get(userController.getUser)
    .post(userController.updateUser)
    .delete(userController.deleteUser)

module.exports = router
