const Category = require("../models/Category")
const objectId = require('mongoose').Types.ObjectId


function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

// create Tag handler function
exports.createCategory = async(req,res) => {
    try {
        const {name,description} = req.body;

        if(!name || !description) {
            return res.status(400).json({
                success:false,
                message:"All Fields are Required",
            })
        }
        // create entry in Database
        const categorysDetails = await Category.create({
            name:name,
            description:description
        });
        // return response
        console.log(categorysDetails);
        return res.status(200).json({
            success:true,
            message:"Category Created Successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


// getAll tags handler function
exports.showAllCategory = async(req,res) => {
    try {
        const allCategory = await Category.find({},{name:true,description:true})
        .populate('courses').exec();
        return res.status(200).json({
            success:true,
            data:allCategory,
            message:"All Tags returned Successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


// category page details
exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
      
      // Get courses for the specified category
      const selectedCategory = await Category.findById(new objectId(categoryId))
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: "ratingAndReviews",
          populate:{
            path:"instructor",
          }
        })
        .exec()
  
      //console.log("SELECTED COURSE", selectedCategory)
      // Handle the case when the category is not found
      if (!selectedCategory) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }
      // Handle the case when there are no courses
      if (selectedCategory.courses.length === 0) {
        console.log("No courses found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        })
      }
  
      // Get courses for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: new objectId(categoryId) },
      })

      let validExpectedCategories = categoriesExceptSelected.filter((cat) => cat.courses.length > 0)

      let differentCategory = await Category.findOne(
        validExpectedCategories[getRandomInt(validExpectedCategories.length)]
          ._id
      )
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate:{
            path:"instructor",
          },
        })
        .exec()
        //console.log("Different COURSE", differentCategory)
      // Get top-selling courses across all categories
      const allCategories = await Category.find()
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: {
            path: "instructor",
        },
        })
        .exec()
      const allCourses = allCategories.flatMap((category) => category.courses)
      const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)
       // console.log("mostSellingCourses COURSE", mostSellingCourses)
      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }