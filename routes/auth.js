var express = require("express");
var router = express.Router();
const { check, validationResult } = require('express-validator');
const { signin, signup, signout, isSignedIn } = require("../controllers/auth");

// signup route
router.post("/signup", [
    // checks for validation on fields with error messages
    check("name").isLength({min:3}).withMessage("User name must be at least 3 character"),
    check("email").isEmail().withMessage("Email format is incorrect"),
    check("password").isLength({min:8}).withMessage("Password must be at least 8 character")
], signup);

// signin route
router.post("/signin", [
    // checks for validation on fields with error messages
    check("email").isEmail().withMessage("Email format is incorrect"),
    check("password").isLength({min:8}).withMessage("Password must be at least 8 character")
], signin);

// signout route
router.get("/signout", signout);

// testing protected routes
router.get("/testroute", isSignedIn, (req,res) => {
    res.json({
        msg : "Allowed",
        data : req.auth
    })
})

module.exports = router;