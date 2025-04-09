const CourseProgress = require("../models/CourseProgress")
const SubSection = require("../models/SubSection")

exports.updateCourseProgress = async(req,res) => {
    const {courseId,subSectionId} = req.body
    const userId = req.user.id

    try {
        const subSection = await SubSection.findById(subSectionId)

        if(!subSection){
            return res.status(404).json({
                success:false,
                message:"Invalid SubSection"
            })
        }

        let courseProgress = await CourseProgress.findOne(
            {
                courseID:courseId,
                userId:userId
            }
        )

        if(!courseProgress){
            return res.status(404).json({
                success:false,
                message:"Course Progress does Not Exist",
            })
        }
        else{
            // check for re-completing video or subsection
            if(courseProgress.completedVideos.includes(subSectionId)){
                return res.status(404).json({
                    success:false,
                    error:"Subsection already Completed"
                })
            }
            courseProgress.completedVideos.push(subSectionId) 
        }
        await CourseProgress.save()
        return res.status(200).json({
            success:true,
            message:"Course Progress Updated"
        })
    } catch (error) {
        console.log("Update Course Progress error:",error)
        return res.status(400).json({
            success:false,
            message:"Internal Server Error",
            error:error.message
        })
    }
}