// Import the Required Models
const express = require("express");
const router = express.Router();

// import the required controllers and middleware functions
const{
    login,
    signup,
    sendotp,
    changePassword
} = require("../controllers/Auth");


const {
    resetPassword,
    resetPasswordToken
} = require("../controllers/ResetPassword");

const {auth} = require("../middlewares/auth")

// Routes for login,signup ,and authentication

// ****************************************************************************************
//                                       Authentication 
// ****************************************************************************************

// route for user login
router.post("/login",login)

// router for user signup
router.post("/signup",signup)

// route for sending otp to the user's email
router.post("/sendotp",sendotp)

// router for changing the password
router.post("/changepassword",auth,changePassword)

// *****************************************************************************************************
//                                                Reset password
// *****************************************************************************************************

// router for generating the reset password token
router.post('/reset-password-token',resetPasswordToken)

// router for resetting user's password after verification
router.post("/reset-password",resetPassword)

// router for resetting user's password after generating the token
router.post("/reset-password",resetPassword);

module.exports = router;