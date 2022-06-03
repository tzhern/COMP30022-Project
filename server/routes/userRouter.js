const express = require("express");
const jwt = require('jsonwebtoken');
const passport = require('passport')
require('../config/passport')(passport)
const userRouter = express.Router()
const userController = require('../controllers/userController')
const { validateUserCookies } = require('./utility')

userRouter.post('/login', userController.login);

userRouter.post('/signup', userController.signup);

// Logout
userRouter.post('/logout', function(req, res) {
    // save the favourites
    res.clearCookie('userId');
    res.clearCookie('jwt');
    console.log('logout successfully')
    return res.status(200).json({ msg: 'Logout successfully' })
});

// Get user info
userRouter.get('/profile', validateUserCookies, passport.authenticate('jwt', { session: false }), userController.getUserInfo)

// Edit profile
userRouter.put('/profile', validateUserCookies, passport.authenticate('jwt', { session: false }),  userController.updateProfile)

module.exports = userRouter