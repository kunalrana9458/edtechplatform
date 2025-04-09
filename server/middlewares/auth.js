const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User.model");

// auth
exports.auth = async (req, res, next) => {
  try {
    // extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorisation")?.replace("Bearer ", "");



      console.log("TOKEN IS.......... IN COURSE API",token)

      if(!token){
        return res.status(401).json({
            success:false,
            message:'Token is Invalid'
        })
      }

      // verify the token 
      try {
        const decode =  jwt.verify(token,process.env.JWT_SECRET);
        console.log(decode);
        req.user = decode;
      } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Token is Invalid",
        });
      }
      next();
  } catch (error) {
    return res.status(401).json({
        success:false,
        message:error.message,
    });
  }
};

// isStudent
exports.isStudent = async(req,res,next) => {
    try {
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This route is Protected for students only"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified",
        })
    }
}

// isInstructor
exports.isInstructor = async(req,res,next) => {
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This route is Protected for Instructor only"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified",
        })
    }
}


// isAdmin
exports.isAdmin = async(req,res,next) => {
    try {
        console.log("Printing AccountTyoe:",req.user.accountType)
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This route is Protected for Admin only"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified",
        })
    }
}

