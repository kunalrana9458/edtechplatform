const Section = require("../models/Section")
const Course = require('../models/Course')
const SubSection = require('../models/SubSection')

exports.createSection = async(req,res) => {
    try {
        // data fetch from req body
        const{sectionName,courseId} = req.body
        // data validation 
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties",
            })
        }
        // create section 
        const newSection = await Section.create({sectionName});
        // update course with section objectId
        const updatedCourseDetails = await Course.findOneAndUpdate(
                                           {_id:courseId},
                                           {
                                            $push:{
                                                courseSchema:newSection._id
                                            }
                                           },
                                           {new:true},
        ).populate({
            path:'courseSchema',
            populate:{
                path:'subSection',
                model:'SubSection'
            }
        }).exec() 
        // return response
        return res.status(200).json({
            success:true,
            message:'Section created successfully',
            updatedCourseDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to create Section, Please Try Again",
            message:error.message,
        })
    }
}

exports.updateSection = async(req,res) => {
    try {
        // data fetch from the req body
        const {sectionName,courseId,sectionId} = req.body
        // data validation 
        
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:'Missing Prooperties'
            })
        }
        // update data in section
        const section = await Section.findByIdAndUpdate(sectionId,{sectionName:sectionName},{new:true});

        const updatedCourse = await Course.findById(courseId).populate({
            path:'courseSchema',
            populate:{
                path:'subSection',
                model:'SubSection'
            }
        }).exec() 
        // return res 
        return res.status(200).json({
            success:true,
            message:"Section Updated Successfully",
            data:updatedCourse
        })
    } catch (error) {
        return res.status(500).json({
            success:true,
            message:error.message
        })
    }
}

exports.deleteSection = async(req,res) => {
    try {
        // fetch id -assume that we are sending ID in params
        const{sectionId,courseId} = req.body

        // delete section from the code
        await Course.findByIdAndUpdate(courseId,{
            $pull:{
                courseSchema:sectionId
            }
        },{new:true});

        // use findByIdAndDelete and delete the data
        const section = await Section.findById(sectionId)

        if(!section){
            return res.status(404).json({
                success:false,
                message:"Section Not Found",
            })
        }

        // delete subsection of that particular section
        await SubSection.deleteMany({_id:{$in:section.subSection}})

        // find the updated course after deleting the section and return it
        const updatedCourse = await Course.findById(courseId).populate({
            path:"courseSchema",
            populate:{
                path:"subSection"
            }
        }).exec()
        
        // return response
        return res.status(200).json({
            success:true,
            message:"Section Deleted Successfully",
            data:updatedCourse,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}