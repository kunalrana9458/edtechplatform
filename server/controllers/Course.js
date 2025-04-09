const Category = require("../models/Category");
const Course = require("../models/Course");
const User = require("../models/User.model");
const {uploadImageToCloudinary} = require("../utils/imageUploader")
const Section = require("../models/Section")
const SubSection = require('../models/SubSection')
const CourseProgress = require("../models/CourseProgress")
const {convertSecondsToDuration} = require("../utils/secToDuration")

require("dotenv").config();


// create course handler function
exports.createCourse = async(req,res) => {
    try {
        // fetch data 
        const {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag,
            category,
            status,
            instructions} = req.body;
        // extract or fetch file (req.file path)
        const thumbnail = req.files.thumbnailImage;
        console.log(req.body)
        console.log(thumbnail)
        // validation
        if(
            !courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            !price ||
            !tag ||
            !thumbnail ||
            !category
        ) {
            return res.status(400).json({
                success:false,
                message:"All Fields are Mandatory",
            });
        }
        // instructor validation check given user is instructor or not and instructor id into the Course Schema
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details",instructorDetails);

        if(!instructorDetails){ 
            return res.status(404).json({
                success:false,
                message:"Instructor Details Not Found",
            });
        }
        // check tag given by instructor is valid or invalid
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails){
            return res.status(404).json({
                success:false,
                message:"Tag Details not found"
            });
       }
        // upload image to the cloudinary -> cloudinary gives a secure url for image
        const thumbnailImage = await uploadImageToCloudinary(
            thumbnail,
            process.env.FOLDER_NAME)
            
        // create an new course entry in the DB
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            tag:tag,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
            status:status,
            instructions:instructions,
        })
        // add course entry into the user Schema
        await User.findByIdAndUpdate(
            {
                _id:instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id,
                }
            },
            {new:true},
        );

        // add the new course to the categories
        await Category.findByIdAndUpdate(
            {_id:category},
            {
                $push:{
                    courses:newCourse._id 
                },
            },
            {new:true}
        )

        // add course entry into the tag Schema -> Homeword
        return res.status(200).json({
            success:true,
            message:"Course Created Successfully",
            data:newCourse
        })
    } catch (error) {
        console.log("Course Creation Error:",error);
        return res.status(500).json({
            success:false,
            message:"Failed to create New Course",
            error:error.message,
        })   
    }
}

// get all courses handler
exports.getAllCourses = async(req,res) => {
    try {
        const allCourses = await Course.find({},{
            courseName:true,
            price:true,
            thumbnail:true,
            instructor:true,
            ratingAndReviews:true,
            studentEnrolled:true,
        }).populate("instructor")
          .exec();

        return res.status(200).json({
            success:true,
            message:"All Courses Fetched Successfully",
            data:allCourses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot fetch Course Data",
            error:error.message,
        })
    }
}

// edit course api
exports.editCourse = async(req,res) => {
    try {
        const {courseId} = req.body
        const updates = req.body
        const course = await Course.findById(courseId)

        if(!course){
            return res.status(404).json({
                success:false,
                message:"Course not Found"
            })
        }

        // if thubmnail image find updated
        if(req.files){
            console.log("Thumbnail update")
            const thumbnail = req.files.thumbnailImage
            const thumbnailImage = await uploadImageToCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
            )
            course.thumbnail = thumbnailImage.secure_url
        }

        // updates only the field that are present in the request body
        for(const key in updates){
            if(updates.hasOwnProperty(key)){
                if(key === 'tag' || key === 'instructions'){
                    course[key] = JSON.parse(updates[key])
                }
                else{
                    course[key] = updates[key]
                }
            }
        }

        await course.save()

        const updatedCourse = await Course.findOne({
            _id:courseId,
        }).populate({
            path:'instructor',
            populate:{
                path:"additionalDetails"
            }
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
            path:"courseSchema",
            populate:{
                path:"subSection"
            }
        })
        .exec()

        res.status(200).json({
            success:true,
            message:"Course Updated Successfully",
            data:updatedCourse
        })

    } catch (error) {
        
    }
}

// getAllCourses handler function
exports.getCourseDetails = async(req,res) => {
    try {
        // get course id
        const {courseId} = req.body;

        if(!courseId){
            return res.status(404).json({
                success:false,
                message:"CourseId Not Found"
            })
        }

        console.log("Course Id is:",courseId)
        // get course Details
        const courseDetails = await Course.find(
                                        {_id:courseId})
                                        .populate({
                                            path:"instructor",
                                            populate:{
                                                path:"additionalDetails"
                                            }
                                        })
                                        .populate("category")
                                        .populate("ratingAndReviews")
                                        .populate({
                                            path:"courseSchema",
                                            populate:{
                                                path:"subSection",
                                            },
                                        })
                                        .exec();

        // validation
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:`Could Not Find the Course with ${courseId}`
            })
        }
        // return response 
        return res.status(200).json({
            success:true,
            message:"Course Details Fetched Successfully",
            data:courseDetails,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message,
        })   
    }
}


// get all instructor courses
exports.getInstructorCourses = async(req,res) => {
    const instructorId = req.user.id
    try {

        if(!instructorId){
            return res.status(400).json({
                success:false,
                message:"Invalid Instructor"
            })
        }

        const instructorCourses = await Course.find({
            instructor:instructorId  
        }).sort({createdAt:-1})

        // return the instructor courses 
        res.status(200).json({
            success:true,
            message:"Instructor Course Fetched Successfully",
            data:instructorCourses,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Something Went Wrong",
            error:error.message
        })
    }
}

exports.deleteCourse = async(req,res) => {
    try {
        const {courseId} = req.body
        const course = await Course.findById(courseId).populate({
            path:"courseSchema",
            populate:{
                path:"subSection"
            }
        })

        console.log("COURSE IS:",course)
        if(!course){
            return res.status(404).json({
                success:false,
                message:"Course not Found"
            })
        }
        // find enrolledStudents in the course so that particular course are also deleted from the User model of courses
        const studentsEnrolled = course.studentEnrolled || []
        // query to unenroll students from the course
        if(studentsEnrolled > 0){
            await User.updateMany(
            {_id: { $in: studentsEnrolled } },
            { $pull : {courses:courseId} }
        )
        }
        
        // now delete section and Subsection from Section and SubSection model which is present in deleted course
        const courseSections = course.courseSchema

        console.log("COURSE SECTION:",courseSections)

        // find all sections of courseSchema in one query
        const sections = await Section.find({_id: {$in:courseSections}}).populate("subSection")

        // extract all subsection IDs from found sections
        const subSectionIds = sections.flatMap(section => section.subSection.map((sub) => sub._id))

        if(subSectionIds.length > 0){
            await SubSection.deleteMany({_id:{$in:subSectionIds}})
        }

        // delete all sections in one query
        await Section.deleteMany({_id:{$in:courseSections}})

        await Course.findByIdAndDelete(courseId)


        return res.status(200).json({
            success:true,
            message:"Course Deleted Successfully"
        })


    } catch (error) {
        console.log("Error in Deleting the Course:",error)
        return res.status(500).json({
            success:false,
            message:"Something went Wrong",
            error:error.message
        })
    }
}

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    console.log("REQUEST BODY IS:",req);
    console.log(`COURSE IS ID ${courseId} and USERID IS ${userId}`)
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseSchema",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseSchema.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.getStudentAllCourses = async(req,res) => {
    try {
        const userId = req.user.id

        if(!userId){
            return res.status(400).json({
                success:false,
                message:"User id is Invalid"
            })
        }

        // fetch all courses for the particular students
        const courses = await User.findById(userId)
                                  .populate({
                                    path:"courses",
                                    populate:{
                                        path:"courseSchema",
                                        populate:{
                                            path:"subSection"
                                        }
                                    }
                                  })

        // return response
        return res.status(200).json({
            success:true,
            data:courses,
        })
    } catch (error) {
        console.log("Error:",error)
        return res.status(500).json({
            success:false,
            message:"Something went wrong",
            error:error.message
        })   
    }
}