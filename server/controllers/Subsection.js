const Section = require('../models/Section')
const {uploadImageToCloudinary} = require('../utils/imageUploader')
const SubSection = require('../models/SubSection')
const mongoose = require("mongoose")
// HW-update delete Controller
require('dotenv').config()

exports.createSubSection = async (req, res) => {
    try {
      // Extract necessary information from the request body
      const { sectionId, title, description } = req.body
      const video = req.files.video
  
      console.log("Subsetion data,::::",sectionId,title,description,video)

      // Check if all necessary fields are provided
      if (!sectionId || !title || !description || !video) {
        return res
          .status(404)
          .json({ success: false, message: "All Fields are Required" })
      }
  
      // Upload the video file to Cloudinary
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      )
      // Create a new sub-section with the necessary information
      const SubSectionDetails = await SubSection.create({
        title: title,
        timeDuration: `${uploadDetails.duration}`,
        description: description,
        videoUrl: uploadDetails.secure_url,
      })
  
      // Update the corresponding section with the newly created sub-section
      const sectionDetail = await Section.findById(new mongoose.Types.ObjectId(sectionId)) 
      const updatedSection = await Section.findByIdAndUpdate(
        sectionId ,
        { $push: { subSection: SubSectionDetails._id } },
        { new: true }
      ).populate("subSection")
  
      // Return the updated section in the response
      return res.status(200).json({ success: true, data: updatedSection })
    } catch (error) {
      // Handle any errors that may occur during the process
      console.error("Error creating new sub-section:", error)
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }

// update subsection and delete Subsection -> HOMEWORK
exports.deleteSubSection = async(req,res) => {
  try {
    const {subSectionId,sectionId} = req.body

    if(!subSectionId || !sectionId){
      return res.status(400).json({
        success:false,
        message:"All Fields are required",
      })
    }

    await Section.findByIdAndUpdate(
      {_id:sectionId},
      {
        $pull:{
          subSection:subSectionId,
        },
      }
    )

    const subSection = await SubSection.findByIdAndDelete({_id:subSectionId})

    if(!subSection){
      return res.status(404).json({
        success:false,
        message:"No Subsection Found",
      })
    }

    const updatedSection = await Section.findById(sectionId).populate("subSection")

    return res.status(200).json({
      success:true,
      data:updatedSection,
      message:"Sub Section Deleted Successfully",
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success:false,
      message:error.message,
    })
  }
}

exports.updateSubSection = async(req,res) => {
  const {sectionId,subSectionId,title,description} = req.body
  const subSection = await SubSection.findById(subSectionId)

  try {
    if(!subSection){
      return res.status(404).json({
        success:false,
        message:"SubSection Not Found",
      })
    }
  
    if(title !== undefined && title !== null){
      subSection.title = title
    }
  
    if(description !== undefined && description !== null){
      subSection.description = description
    }
  
    if(req.files && req.files.video !== undefined){
      const video = req.files.video
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      )
      subSection.videoUrl = uploadDetails.secure_url
      subSection.timeDuration = `${uploadDetails.duration}`
    }
  
    await subSection.save()

    const updateSection = await Section.findById(sectionId).populate("subSection")

  
    return res.status(200).json({
      success:true,
      data:updateSection,
      message:"Sub Section Updated Successfully"
    })
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success:false,
      message:"An error Occured while updating the section"
    }) 
  }

}