const User = require("../models/user");
const { check, validationResult } = require('express-validator');
const user = require("../models/user");
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

exports.signup = (req,res) => {
    // Checking validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // creating object of User model and saving info in DB
    const user = new User(req.body);
    user.save( (err,user) => {
        if(err){
            return res.status(400).json({
                err : "Not able to save user in DB"
            })
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        })
        // throwing entire user object
        // res.json(user);
    })
}

exports.signin = (req,res) => {
    const { email,password } = req.body;
    // Checking validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    user.findOne({email}, (err,user) => {
        if(err || !user){
            return res.status(400).json({ error : "Email ID does not exist"})
        }
        // checking for password
        if(!user.authenticate(password)){
            return res.status(401).json({ error : "Email ID and Password is not matched"})
        }

        // creating token
        const token = jwt.sign({_id : user._id}, process.env.SECRET_KEY)
        // sending token in cookie
        res.cookie(token)

        // response to frontend
        const { _id, name, email, role} = user;
        return res.json({
            token : token,
            user : {
                _id, name, email, role
            }
        })
    })
}

exports.signout = (req,res) => {
    res.clearCookie("token");
    res.json({
        message : "User Signout Successfully"
    });
}

// protected routes
exports.isSignedIn = expressJwt({
    secret : process.env.SECRET_KEY,
    userProperty : "auth"
})

// custom middlewares
exports.isAuthenticated = (req,res,next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id
    if(!checker){
        return res.status(403).json({
            error : "ACCESS DENIED"
        })
    }
    next();
}

exports.isAdmin = (req,res,next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error : "You are not ADMIN, ACCESS DENIED"
        })
    }
    next();
}