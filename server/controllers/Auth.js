const User = require("../models/User.model");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const mailSender = require("../utils/mailSend")
const {passwordUpdated} = require("../mail/templates/passwordUpdate")
const jwt = require("jsonwebtoken");
require("dotenv").config();


// sendOtp
exports.sendotp = async (req, res) => {
  try {
    // fetch email from req body
    const { email } = req.body;
    // check if user already exist
    const checkUserPresent = await User.findOne({ email });
    // if user already exist
    if (checkUserPresent) {
      return res.json({
        success: false,
        message: "User Already Registerd",
      });
    }
    // generate otp
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("Generated OTP:", otp);
    // check unique otp or not
    const result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };
    // create an entry in DB for otp
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);
    // return response
    res.status(200).json({
      success: true,
      message: "OTP sent Sucessfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// signup
exports.signup = async (req, res) => {
  try {
    // data fetched from req body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp, // maybe some mistake here
    } = req.body;
    // validate the data
    if (!firstName || !lastName || !password || !confirmPassword || !otp) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    // password and confirm password check
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password is not same",
      });
    }
    // check user already exist or not
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Exist",
      });
    }
    // find most recent OTP Stored for the user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);
    // validate otp
    if (recentOtp.length === 0) {
      // otp not exist
      return res.status(400).json({
        success: false,
        message: "OTP not Found",
      });

    } else if (otp !== recentOtp[0].otp) { // buggggggggg
      return res.status(400).json({
        success: false,  
        message: "Invalid OTP",
      });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // create entry into the DB
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });
    // return the response
    return res.status(200).json({
      success: true,
      userdetails:user,
      message: "User Registered Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      meesage: "User Not Registered, Please Try Again!",
    });
  }
};

// login
exports.login = async (req, res) => {
  try {
    // fetch the data
    const { email, password } = req.body;
    // validation of Data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "Fill All The Details",
      });
    }
    // check user exist in the Database or not
    const userExist = await User.findOne({ email }).populate("additionalDetails");
    if (!userExist) {
      return res.status(400).json({ 
        success: false,
        message: "User Doesn't Exist",
      });
    }
    // check password and DB bcrypt password
    if (await bcrypt.compare(password, userExist.password)) {
      // generate JWT token
      const payload = {
        email: userExist.email,
        id: userExist._id,
        accountType: userExist.accountType,
      };
      const token =  jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      // userExist.token = token; // maybee bugggggg
      // userExist.password = undefined;

      // pass JWT Token in a cookie and marked password as undefined
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        userExist,
        message: "Logged in Successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is Incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login Failure, Please try again",
    });
  }
};

// TODO Home Work
// change Password
exports.changePassword = async(req,res) => {
    try {
      // get userdetials from the db to update
      const userDetails = await User.findById(req.user.id);

      // fetch old password, new password and confirm password from the req body
      const {oldPassword,newPassword,confirmPassword} = req.body

      // validate old password
      const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        userDetails.password
      );

      if(!isPasswordMatch){
        return res.status(401).json({
          success:false,
          message:"The Password is Incorrect"
        });
      }

      // validate new password and confirm password is it same or not
      if(newPassword !== confirmPassword){
        return res.status(400).json({
          success:false,
          message:"The Password and Confirm Password Not Matches",
        });
      }

      // update the new Password into the database
      const encryptedPassword = await bcrypt.hash(newPassword,10);
      const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        {password:encryptedPassword},
        {new:true} 
      );

      // send notification email
      try {
        const emailResponse = await mailSender(
          updatedUserDetails.email,
          passwordUpdated(
            updatedUserDetails.email,
            `Password Updated Successfully for ${updatedUserDetails.firstName}`
          )
        );
      } catch (error) {
        // if there us any error during email verification
        console.error("Error Occured while sending the Password Changed Email")
        return res.status(500).json({
          success:false,
          message:"Error occured while Sending email",
          error:error.message,
        });
      }

      // return success response
      return res.status(200).json({
        success:true,
        message:"Password Updated Successfully",
      })
    } catch (error) {
      // if there is any error during the updating the password
      console.error("Error occured while updating the Password",error);
      return res.status(500).json({
        success:false,
        message:"Error Occured while updatind the Password",
        error:error.message,
      });
    };
};   