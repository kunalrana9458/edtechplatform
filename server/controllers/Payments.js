const { instance } = require("../config/razorpay");
const Course = require('../models/Course')
const User = require('../models/User.model')
// mailsender add krna hai abhi mail/template naam ka folder mai and courder email bhu add krna hai
const mailSend = require('../utils/mailSend')
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail"); // yet to create that file
const {paymentSuccessEmail} = require("../mail/templates/paymentSuccessEmail")
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");

// intiate the razopay order
exports.capturePayment = async(req,res) => {
    const  {courses} = req.body;
    console.log(courses);
    console.log("Type is:",typeof courses[0])
    const userId = req.user.id 

    if(courses.length === 0){
        return res.json({success:false,message:"Please Provide Course Id"})
    }

    let totalAmount=0;

    for(const course_id of courses){
        let course;
        try {
            course = await Course.findById(course_id)
            if(!course){
                return res.status(404).json({
                    success:false,
                    message:"Could Not Find Course"
                })
            }

            const uid = new mongoose.Types.ObjectId(userId)
            if(course.studentEnrolled.includes(uid)){
                return res.status(200).json({
                    success:false,
                    message:"Student is already Enrolled"
                })
            }
            totalAmount += course.price
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success:false,
                message:error.message
            })
        }
    }

    const options = {
        amount:totalAmount*100,
        currency:'INR',
        receipt: Math.random(Date.now()).toString()
    }

    try {
        const paymentResponse = await instance.orders.create(options)
        res.json({
            success:true,
            data:paymentResponse
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Could Not Initiate Order"
        })
    }

}

// verifycation of payment 

exports.verifyPayment = async(req,res) => {
    const razorpay_order_id = req.body?.razorpay_order_id
    const razorpay_payment_id = req.body?.razorpay_payment_id
    const razorpay_signature = req.body?.razorpay_signature
    const courses = req.body?.courses
    const userId = req.user.id

    if(!razorpay_order_id || !razorpay_payment_id ||
       !razorpay_signature || !courses | !userId
    ){
        return res.status(401).json({
            success:false,
            message:"Payment Failed"
        })
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
    .createHmac("sha256",process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex")

    if(expectedSignature === razorpay_signature){
        // enroll the student
        await enrollStudents(courses,userId,res)
        // return res
        return res.status(200).json({
            success:true,
            message:"Payment Verified"
        })
    }
    return res.status(402).json({
        success:false,
        message:"Payment Failed"
    })
}


const enrollStudents = async(courses,userId,res) => {

    if(!courses || !userId){
        return res.status(400).json({
            success:false,
            message:"Please Provide data for Courses or UserId"
        })
    }

    for(const courseId of courses){
        try {
            // find the course and enrolled student in it
        const enrolledCourse = await Course.findOneAndUpdate(
            {_id:courseId},
            {$push:{studentEnrolled:userId}},
            {new:true}
        )

        if(!enrolledCourse){
            return res.status(404).json({
                success:false,
                message:"Course not Found"
            })
        }

        // creation of course progress
        const courseProgress = await CourseProgress.create({
            courseID:courseId,
            userId:userId,
            completedVideos:[],
        })

        // find the student to enroll in the course
        const enrolledStudent = await User.findByIdAndUpdate(userId,
            {$push:{courses:courseId},
             courseProgress:courseProgress._id},
            {new:true}
        )

        // send mail to the enrolled student
        const emailResponse = await mailSend(
            enrolledStudent.email,
            `Successfully Enrolled into ${enrolledCourse.courseName}`,
            courseEnrollmentEmail(enrolledCourse.courseName,`${enrolledStudent.firstName}`)
        )
        // console.log("Email Sent Successfully",emailResponse)
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success:false,
                message:error.message
            })
        }
    }

}


exports.sendPaymentSuccessEmail = async(req,res) => {
    const {orderId,paymentId,amount} = req.body
    const userId = req.user.id

    if(!orderId || !paymentId || !amount || !userId){
        return res.status(400).json({
            success:false,
            message:"Please Provide all the fields",
        })
    }

    try {
        const enrolledStudent = await User.findById(userId)
        await mailSend(
            enrolledStudent.email,
            `Payment Recieved`,
            paymentSuccessEmail(`${enrolledStudent.firstName}`,
            amount/100,orderId,paymentId)
        )
    } catch (error) {
        console.log("Error in sending mail",error)
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


// capture the payment and initaite the razorpay order
// exports.capturePayment = async(req,res) => {
//     // get course id and user id
//     const {course_id} = req.body
//     const userId = req.user.id
//     // validation / valid course id or not
//     if(!course_id){
//         return res.status(400).json({
//             success:false,
//             message:"Please Provide Valid Course Id"
//         })
//     }
//     // validation courseDetails
//     let course;
//     try {
//         course = await Course.findById(course_id);
//         if(!course){
//             return res.status(400).json({
//                 success:false,
//                 message:"Could Not find the Course"
//             })
//         }
//         // convert userid id from string to object because it comes in a string form in a req.user.id

//         const uid = new mongoose.Types.ObjectId.createFromTime(userId);
//         // user already pay for the same course or not
//         if(course.studentEnrolled.includes(uid)){
//             return res.status(400).json({
//                 success:false,
//                 message:"Student is Already Enrolled"
//             });
//         }
    
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         })
//     }

//     // creation of order
//     const amount = course.price;
//     const currency = 'INR';

//     const options = {
//         amount:amount*100,
//         currency,
//         receipt:Math.random(Date.now()).toString(),
//         // we add courseId and userId in notes object because after verifying signature we also add particular course whose payment is done to the courseEnrolled of the user in a User model and also studentEnrolled in a course Model
//         notes:{
//             courseId:course_id,
//             userId
//         }
//     };

//     try {
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);
//         return res.status(200).json({
//             success:true,
//             courseName:course.courseName,
//             courseDescription:course.courseDescription,
//             thumbNail:course.thumbnail, // mayyyybe bug here
//             orderId:paymentResponse.id,
//             currency:paymentResponse.currency
//         })
//     } catch (error) {
//         console.log(error)
//         res.json({
//             success:false,
//             message:"Could not initiate order"
//         })
//     }
// };

// verify signature for the authorization of the payment bwtween razorpay and our server
// exports.verifySignature = async(req,res) => {
//     const webhookSecret = "12345678"
//     const signature = req.headers("x-razorpay-signanature")
//     const shasum = crypto.createhmac("sha256",webhookSecret);
//     shasum.update(JSON.stringify(req.body))
//     const digest = shasum.digest(shasum) // digest->the output comes after running hashing algo
    
//     // check authentication
//     if(signature == digest){
//         console.log("Payment is Authorized");
        
//         const {courseId,userId} = req.body.payload.payment.entity.notes;

//         try {
//             // fulfill the action by enrolled the student in a particular course
//             const enrolledCourse = await Course.findByIdAndUpdate(
//                                                     {_id:courseId},
//                                                     {$push:{studentEnrolled:userId}},
//                                                     {new:true},
//             );

//             if(!enrolledCourse){
//                 return res.status(500).json({
//                     success:false,
//                     message:"Course Not Found"
//                 });
//             }

//             // find the User and add that course to the courseEnrolled of the User
//             const enrolledStudent = await User.findByIdAndUpdate(
//                                                 {_id:userId},
//                                                 {$push:{courses:courseId}},
//                                                 {new:true}
//             )

//             console.log(enrolledStudent);

//             // send mail to the mail for their enrollment for the particular course
//             const emailResponse = await mailsender(
//                 enrolledStudent.email,
//                 "Congratulations from StudyNotion",
//                 "Congratulations, you are onboarded into new Studynotion Course",
//             );

//             console.log(emailResponse);
            
//             return res.status(200).json({
//                 success:true,
//                 message:"Signature Verified Successfully",
//             })
            

//         } catch (error) {
//             console.log(error)
//             return res.status(500).json({
//                 success:false,
//                 message:error.message
//             })
//         }
//     }
    
//     else{
//         return res.status(400).json({
//             success:false,
//             message:"Invalid Request"
//         })
//     }
// }

