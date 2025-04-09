const Profile = require('../models/Profile')
const User = require('../models/User.model')
const Course = require('../models/Course')
const {uploadImageToCloudinary} = require("../utils/imageUploader")

exports.updateProfile = async(req,res) => {
    try {
        // fetch details from the req body
        const {dateOfBirth="",about="",contactNumber} = req.body
        const id = req.user.id

        // find profile
        const userDetails = await User.findById(id)
        const profileId = userDetails.additionalDetails

        const profileDetails = await Profile.findById(profileId)
        profileDetails.dateOfBirth = dateOfBirth
        profileDetails.about = about
        profileDetails.contactNumber = contactNumber
        await profileDetails.save()
        // return reponse
        return res.status(200).json({
            success:true,
            message:"Profile Details Updated Successfully",
            profileDetails
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something Went Wrong in Profile Updation",
            error:error.message
        })
    }
}

exports.deleteAccount = async(req,res) => {
    try {
        // fetch id of the user who want to delete account
        const id = req.user.id
        console.log("ID ids:",id)
        // validation and check id present or not
        const userDetails = await User.findById({_id:id})
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"User Not Found"
            })
        }
        //delete profile then delete user after deleting profile
        const profileDetails = userDetails.additionalDetails
        // TODO :HOMEWORK unenrolled user from all enrolled courses should be change so to do that task
        await Profile.findByIdAndDelete({_id:profileDetails._id}) // maybe something bug in that delete
        await User.findByIdAndDelete({_id:id})
        // return response
        return res.status(200).json({
            success:false,
            message:"User Deleted Successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error in User Deletion"
        })
    }
}

exports.getAllUserDetails = async(req,res) => {
    try {
        // find user id by fetching it
        const id = req.user.id
        // check user exist or not
        const userDetails = await User.findById(id)
                               .populate('additionalDetails')
                               .exec()
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"User not Found",
            })
        }
        // return response
        return res.status(200).json({
            success:true,
            message:"User Data Fetched Successfully",
            data:userDetails   
        })

    } catch (error) {
        return res.status(500).json({
            succes:false,
            message:"Error in Fetch Details of User",
            error:error.message
        })
    }
}

exports.updateDisplayPicture = async(req,res) => {
    try {
        const displayPicture = req.files.displayPicture
        const userId = req.user.id 
        console.log("USERID Bkac :",userId)
        const image = await uploadImageToCloudinary(
               displayPicture,
               process.env.FOLDER_NAME,
               1000,
               1000,
        )
        console.log(image)

        const updatedProfile = await User.findByIdAndUpdate(
            {_id:userId},
            {image:image.secure_url},
            {new:true},
        )

        res.status(200).json({
            success:true,
            message:"Image Updated Successfully",
            data:updatedProfile,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

exports.getEnrolledCourses = async(req,res) => {
    try {
        const userId = req.user.id
        const userDetails = await User.findOne({
            _id:userId
        })
        .populate("courses")
        .exec()

        if(!userDetails){
            return res.status(400).json({
                success:true,
                message:`Could not find user with id ${userDetails}`,
            })
        }

        return res.status(500).json({
            success:true,
            data:userDetails.courses,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
};

exports.instructorDashboard = async(req,res) => {
    try {
        const courseDetails = await Course.find({instructor:req.user.id})

        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Course Details Not Found",
            })
        }

        console.log("COUrse detiasil",courseDetails)

        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentEnrolled.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price

            // create a new object with the additional fields
            const courseDataWithStats = {
                _id:course._id,
                courseName:course.courseName,
                courseDescription:course.Description,
                totalStudentsEnrolled,
                totalAmountGenerated
            }
            return courseDataWithStats;
        })

        return res.status(200).json({
            success:true,
            message:"Instructor Dashboard Details",
            courses:courseData
        })

    } catch (error) {
       console.log("Error in instructor dashboard",error)
       return res.status(500).json({
        success:false,
        message:"Internal Server Error",
        error:error.message
       }) 
    }
}