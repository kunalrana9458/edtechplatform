import React, { useEffect, useState } from 'react'
import { useForm} from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import {fetchCourseCategories} from '../../../../../services/operations/courses/categoryAPIs'
import ChipInput from './ChipInput'
import Upload from './Upload'
import RequirementField from './RequirementField'
import { setCourse, setStep } from '../../../../../slices/courseSlice'
import IconButton from '../../../../common/IconButton'
import toast from 'react-hot-toast'
import {addCourseDetails,editCourseDetails} from '../../../../../services/operations/courses/coursesAPIs'
import { COURSE_STATUS } from '../../../../../utils/constants'


const CourseInformationForm = () => {

   const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState:{errors}
   } = useForm()

   const dispatch = useDispatch()
   const {course,editCourse} = useSelector((state) => state.course)
   const {token} = useSelector((state) => state.auth)
   const [loading,setLoading] = useState(false)
   const [courseCategories,setCourseCategories] = useState([])

   useEffect(() => {
    const getCategories = async() => {
      setLoading(true)
      const categories = await fetchCourseCategories()
      console.log(categories)
      if(categories.length > 0){
        setCourseCategories(categories)
      }
      setLoading(false)
    }

    
    if (editCourse) {
      // console.log("data populated", editCourse)
      setValue("courseTitle", course.courseDetails.courseName)
      setValue("courseShortDesc", course.courseDetails.courseDescription)
      setValue("coursePrice", course.courseDetails.price)
      setValue("courseTags", JSON.parse(course.courseDetails.tag))
      setValue("courseBenefits", course.courseDetails.whatYouWillLearn)
      setValue("courseCategory", course.courseDetails.category)
      setValue("courseRequirements", JSON.parse(course.courseDetails.instructions))
      setValue("courseImage", course.thumbnail)
    }

    getCategories();

   },[])

   console.log("COURSE IS:",course)

   const isFormUpdated = () => {
    const currentValues = getValues()
    // console.log("changes after editing form values:", currentValues)
    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseRequirements.toString() !== course.instructions.toString() ||
      currentValues.courseImage !== course.thumbnail
    ) {
      return true
    }
    return false
  }

   //  handle next button click
     const onSubmit = async (data) => {
       console.log(data)
   
       if (editCourse) {
         const currentValues = getValues()
         console.log("changes after editing form values:", currentValues)
         console.log("now course:", course)
        //  console.log("Has Form Changed:", isFormUpdated())
         if (isFormUpdated()) {
           const currentValues = getValues()
           const formData = new FormData()
           // console.log(data)
           formData.append("courseId", course._id)
           if (currentValues.courseTitle !== course.courseName) {
             formData.append("courseName", data.courseTitle)
           }
           if (currentValues.courseShortDesc !== course.courseDescription) {
             formData.append("courseDescription", data.courseShortDesc)
           }
           if (currentValues.coursePrice !== course.price) {
             formData.append("price", data.coursePrice)
           }
           if (currentValues.courseTags.toString() !== course.tag.toString()) {
             formData.append("tag", JSON.stringify(data.courseTags))
           }
           if (currentValues.courseBenefits !== course.whatYouWillLearn) {
             formData.append("whatYouWillLearn", data.courseBenefits)
           }
           if (currentValues.courseCategory._id !== course.category._id) {
             formData.append("category", data.courseCategory)
           }
           if (
             currentValues.courseRequirements.toString() !==
             course.instructions.toString()
           ) {
             formData.append(
               "instructions",
               JSON.stringify(data.courseRequirements)
             )
           }
           if (currentValues.courseImage !== course.thumbnail) {
             formData.append("thumbnailImage", data.courseImage)
           }
           // console.log("Edit Form data: ", formData)
           setLoading(true)
           const result = await editCourseDetails(formData, token)
           setLoading(false)
           if (result) {
             dispatch(setStep(2))
             dispatch(setCourse(result))
           }
         } else {
           toast.error("No changes made to the form")
         }
         return
       }

       console.log("COURSE IS:",course)
   
       const formData = new FormData()
       formData.append("courseName", data.courseTitle)
       formData.append("courseDescription", data.courseShortDesc)
       formData.append("price", data.coursePrice)
       formData.append("tag", JSON.stringify(data.courseTags))
       formData.append("whatYouWillLearn", data.courseBenefits)
       formData.append("category", data.courseCategory)
       formData.append("status", COURSE_STATUS.DRAFT)
       formData.append("instructions", JSON.stringify(data.courseRequirements))
       formData.append("thumbnailImage", data.courseImage)
       setLoading(true)
       const result = await addCourseDetails(formData, token)
       if (result) {
         dispatch(setStep(2))
         dispatch(setCourse(result))
       }
       setLoading(false)
     }

  return (
    <form
    onSubmit={handleSubmit(onSubmit)}
    className='rounded-xl border-richblack-700 bg-richblack-800 p-6 space-y-8' >
      <div className='flex flex-col gap-y-2'>
        <label htmlFor="courseTitle"
        className='text-sm'>Course Title <sup className='text-pink-500'>*</sup> </label>
        <input
        id='courseTitle'
        placeholder='Enter Course Details'
        {...register("courseTitle",{required:true})}
        className='w-full bg-richblack-700 text-richblack-100 p-2 rounded-xl' />
        {
          errors.courseTitle && (
            <span>Course Title is required</span>
          )
        }
      </div>

      <div className='flex flex-col gap-y-2'>
        <label htmlFor="courseShortDesc" className='text-sm'>Course Short Description <sup className='text-pink-500'>*</sup> </label>
        <textarea
        className='w-full bg-richblack-700 text-richblack-100 p-2 rounded-xl'
        id="courseShortDesc"
        placeholder='Enter Description'
        {...register("courseShortDesc",{required:true})}
         />
        {
          errors.courseShortDesc && (
            <span>Enter Description</span>
          )
        }
      </div>

      <div className='flex flex-col gap-y-2'>
        <label htmlFor="coursePrice"
        className='text-sm'>Enter Course Price <sup className='text-pink-500'>*</sup> </label>
        <input 
        id='coursePrice'
        placeholder='Enter Course Price'
        {...register("coursePrice",{required:true,
        valueAsNumber:true})}
        className='w-full bg-richblack-700 text-richblack-100 p-2 rounded-xl' />

        {
          errors.coursePrice && (
            <span>Course Price is required</span>
          )
        }
      </div>

      <div className='flex flex-col gap-y-2'>
        <label
        className='text-sm'
        htmlFor="coureCategory">Course Category <sup className='text-pink-500'>*</sup> </label>
        <select
        id="courseCategory"
        defaultValue=""
        className='w-full bg-richblack-700 text-richblack-100 p-2 rounded-xl'
        {...register("courseCategory",{required:true})}>
          <option value=""
          disabled>Choose a Category</option>
          {
            !loading && courseCategories.map((category,index) => (
              <option
              value={category?._id}
              key={index} 
              className='bg-richblack-700' > {category?.name} </option>
            ))
          }
        </select>
        {
          errors.courseCategory && (
            <span>Course Category is required</span>
          )
        }
      </div>

      {/* // create a custom component for handling tags as input  */}
      <ChipInput
      label="Tags"
      name="courseTags"
      placeholder="Enter tags and press enter"
      register={register}
      errors={errors}
      setValue={setValue}
      getValues={getValues} />

      {/* create a component for uploading and showing preview of media  */}
      <Upload
      name='courseImage'
      label='Course Thumbnail'
      register={register}
      errors={errors}
      getValues={getValues}
      setValue={setValue}
      />

      {/* benefits of the course   */}
      <div className='flex flex-col gap-y-2'>
        <label htmlFor="courseBenefits"
        className='text-sm'>Benefits of the course <sup className='text-pink-500'>*</sup> </label>
        <textarea
        id='courseBenefits'
        placeholder='Enter Benefits of the course'
        {...register("courseBenefits",{required:true})}
        className='min-h-[130px] w-full bg-richblack-700 rounded-lg p-2' />
      </div>

      <RequirementField
      name='courseRequirements'
      placeholder='Enter Course Requirement'
      label='Requirements/Instructions'
      errors={errors}
      setValue={setValue}
      register={register}
      getValues={getValues}
       />

       <div>
        {
          editCourse && (
            <button
            onClick={() => dispatch(setStep(2))}
            className='flex items-center gap-x-2 bg-richblack-300' >
             Continue Without Saving
            </button>
          )
        }
       </div>

       <IconButton
       text={!editCourse ? 'Next' : 'Save Changes' } />

    </form>
  )
}

export default CourseInformationForm
