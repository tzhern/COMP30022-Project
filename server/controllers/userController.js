require('dotenv').config();    // for JWT password key
const User = require('../models/user');
const mongoose = require('mongoose');
const passport = require("passport");
const jwt = require("jsonwebtoken");
const ObjectId = require('mongoose').Types.ObjectId;
const { validatePassword } = require('../routes/utility')


const signup = (req, res, next) => {
    // validate password
    if (!validatePassword(req.body.password)) {
        console.log('Password must be longer than 8 characters!')
       return res.status(400).json({ msg: "Password must be longer than 8 characters!" });
    }
    // check if both password match
    else if (req.body.password !== req.body.confirmPassword){
        console.log('Password does not match')
        return res.status(400).json({ msg: "Password does not match" });
    }
    passport.authenticate('local-signup', (err, user, msg) => {
        if (err) {
            return res.status(500).json({ msg: msg })
        }
        else if (!user) {
            return res.status(400).json({ msg: msg })
        }
        req.login(user, { session: false }, async (error) => {
            if (error) return res.status(500).json({ msg: error });
            const body = { _id: user.emailAddress };
            const token = jwt.sign({ body }, process.env.PASSPORT_KEY);
            res.cookie('jwt', token, { httpOnly: false, sameSite: true, secure: false });
            res.cookie('userId', user.id, { maxAge: 30 * 24 * 60 * 60 * 1000 });
            const data = { userId: user.id };
            return res.status(200).json({ data: data, token: token});
        })
    })(req, res, next)
};

const login = async(req, res, next) => {
    passport.authenticate('login', async (err, user, msg) => {
        try {
            // if there were errors during executing the strategy
            // or the user was not found, we display and error and
            // delete related cookies for security reason
            if(err) {
                return res.status(500).json({ msg: msg })
            } else if (!user) {
                return res.status(401).json({ msg: msg })
            }

            req.login(user, { session : false }, async (err) => {
                if(err) return next(err);
                const body = { _id : user.emailAddress };
                //Sign the JWT token and populate the payload with the user email
                const token = jwt.sign({ body },process.env.PASSPORT_KEY);
                //Send back the token to the client
                res.cookie('jwt', token, { httpOnly: false, sameSite: false, secure: true });
                res.cookie('userId', user.id, { maxAge: 30 * 24 * 60 * 60 * 1000 });
                const data = { _id: user.id };
                return res.status(200).json({ data: data, token: token });
            });
        } catch (err) {
            return res.status(500).json({ msg: msg });
        }
    })(req, res, next)
}

const updateProfile = async(req, res) => {
    let userId = new ObjectId(req.user._id);
    try {
        let user = await User.findOne({ _id: userId })
        let givenName = req.body.givenName;
        let familyName = req.body.familyName;
        let emailAddress = req.body.emailAddress;
        let password = req.body.password;
        
        // update the information that User has changed
        if (givenName){
            await User.updateOne({ _id: userId }, { $set: { givenName: givenName } })
        }
        if (familyName){
            await User.updateOne({ _id: userId }, { $set: { familyName: familyName } })
        }
        if (emailAddress){
            await User.updateOne({ _id: userId }, { $set: { emailAddress: emailAddress } })
        }
        if (password){
            if (!validatePassword(password)) {
                  return res.status(400).json({ msg: "Password must be longer than 8 characters!" });
            }
            await User.updateOne({ _id: userId }, { $set: { password: User().generateHash(req.body.password) } })
        }
        
        // get User after updating
        user = await User.findOne({ _id: userId }, { _id: true, givenName: true, familyName: true, emailAddress: true }).lean()

        if (user) {
            console.log("update profile sucessfully")
            res.status(200).json(user)
        } else {
            console.log('User not found')
            res.status(409).json({ msg: 'User not found' })
        }
    } catch (err) {
        res.status(500).json({ msg: err })
    }
}

const getUserInfo = async(req, res) => {
    let userId = new ObjectId(req.user._id);
    try {
        let user = await User.findOne({ _id: userId }, { _id: false, givenName: true, familyName: true, emailAddress: true }).lean();
        return res.status(200).json({ user: user });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: err });
    }
}

module.exports={ signup, login, getUserInfo, updateProfile }