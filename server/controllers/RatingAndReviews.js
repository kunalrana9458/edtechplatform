const RatingAndReview = require("../models/RatingAndReviews");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

// create rating
exports.createRatingAndReview = async (req, res) => {
    try {
        // get user id who give rating
        const userId = req.user.id;
        // find course Id on which we want to create Rate and Review and fetch data
        const { rating, review, courseId } = req.body;
        // validate the course Id and userID
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User Not LoggedIn",
            });
        }
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Not a Valid Course Id",
            });
        }
        // check if user is enrolled or not
        const courseDetails = await Course.find({
            _id: courseId,
            studentEnrolled: { $elemMatch: { $eq: userId } },
        });

        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: "Student Not Enrolled in the Course",
            });
        }
        // check weather already rate and review the course or not
        const alreadyReviewd = await RatingAndReview.findOne({
            user: userId,
            course: courseId, // mayyyyyybe bug hereeee
        });

        if (alreadyReviewd) {
            return res.status(400).json({
                success: false,
                message: "Course is Already Reviewd by the User",
            });
        }
        // create a rating And Review
        // saved rating across the course in the RateAndReview Model in Database
        const ratingReview = await RatingAndReview.create({
            rating,
            review,
            course: courseId,
            user: userId,
        });
        // attached that rating and review on that particular course
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            {_id:courseId},
            {
                $push: {
                    ratingAndReviews: ratingReview._id,
                },
            },
            { new: true }
        );

        console.log(updatedCourseDetails);
        // return response
        return res.status(200).json({
            success: true,
            message: "Rating and Review created Successfully",
            ratingReview,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// get Average Rating
exports.getAverageRating = async(req,res) => {
    try {
        // get course id
        const {courseId} = req.body
        // call from DB do aggregation and find calculate average Rating
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId.createFromTime(courseId)
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:$rating}
                }
            }
        ])
        // return rating
        if(result.length > 0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            })
        }

        // if rating not exist
        return res.status(200).json({
            success:true,
            message:"Average Rating is 0, no rating Given Till now"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });   
    }
}

// get all Rating and Review
exports.getAllRatingAndReview = async(req,res) => {
    try {
        const allReviews = await RatingAndReview.find({})
                                 .sort({rating:"desc"})
                                 .populate({
                                    path:"user",
                                    select:"firstName lastName email image"
                                 })
                                 .populate({
                                    path:"course",
                                    select:"courseName"
                                 })
                                 .exec();
                                
        return res.status(200).json({
            success:true,
            message:"All Review Fetched Successfully",
            data:allReviews
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });   
    }
}



// find all rating and review corresponding to the particular course  -> HHHHWWWWWW
