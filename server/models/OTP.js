const mongoose = require("mongoose");
const mailSend = require("../utils/mailSend");
const emailVerificationTemplate = require('../mail/templates/emailVerificationTemplate')

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:String,
        default:Date.now(),
        expires:5*60,
    }
});

// a function -> to send mails
async function sendVerificationEmail(email,otp){
    try {
        const mailResponse = await mailSend(email,"Verification Email from studyNotion",emailVerificationTemplate(otp));      
        console.log("Mailresponse:",mailResponse);
    } catch (error) {
        console.log("Error occured while verifying the email",error);
    }
}

OTPSchema.pre("save",async function(next) {
    await sendVerificationEmail(this.email,this.otp);
    next();
})


module.exports = mongoose.model("OTP",OTPSchema);