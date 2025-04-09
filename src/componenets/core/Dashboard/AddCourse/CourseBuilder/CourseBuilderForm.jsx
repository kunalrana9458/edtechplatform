import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import IconButton from '../../../../common/IconButton'
import { MdAddCircleOutline } from "react-icons/md";
import {useDispatch, useSelector} from 'react-redux'
import { FaArrowRight } from "react-icons/fa";
import NestedView from './NestedView';
import { setCourse, setEditCourse, setStep } from '../../../../../slices/courseSlice';
import toast from 'react-hot-toast';
import { updateSection,createSection } from '../../../../../services/operations/courses/coursesAPIs';
import { IoIosArrowBack,IoIosArrowForward } from "react-icons/io";


const CourseBuilder = () => {

    const{register,handleSubmit,setValue,formState:{errors}} = useForm()
    const [editSectionName,setEditSectionName] = useState(null)
    const {course} = useSelector((state) => state.course)
    const dispatch = useDispatch();
    const [loading,setLoading] = useState(false)
    const {token} = useSelector((state) => state.auth)

    console.log(course)
    console.log(course?.courseSchema)

    const cancelEdit = () => {
      setEditSectionName(null)
      console.log(editSectionName);
      setValue("sectionName","")
    }

    const goBack = () => {
      dispatch(setStep(1))
      dispatch(setEditCourse(true))
    }

    const gotoNext = () => {
      if(course.courseSchema.length === 0){
        toast.error("Please Add atleast One Section")
        return ;
      }
      if(course.courseSchema.some((section) =>  section.subSection.length === 0)){
        toast.error("Please Add atleast one lecture in each section")
        return ;
      }
      dispatch(setStep(3));
    }

    console.log(editSectionName)

    const onSubmit = async(data) => {
      setLoading(true)
      let result;

      if(editSectionName){
        result = await updateSection({
          sectionName:data.sectionName,
          sectionId:editSectionName,
          courseId:course._id
        },token)
      }
      else{
        result = await createSection({
          sectionName:data.sectionName,
          courseId:course._id
        },token)
      }

      console.log("Result is :....",result)
      // update values -> sone changes
      if(result){
        dispatch(setCourse(result))
        setEditSectionName(null)
        setValue("sectionName","")
      }
      setLoading(false)
    }

    const handleChangeEditSectionName = (sectionId,sectionName) => {

      if(editSectionName === sectionId){
        cancelEdit()
      }

      setEditSectionName(sectionId)
      setValue("sectioName",sectionName)
    }

  return (
    <>
      <div className='bg-richblack-800 p-6 rounded-xl'>
      <p className='my-2 text-xl'>Course Builder</p>
      <form
      onSubmit={handleSubmit(onSubmit)} >
        <div>
            <input
            className='p-2 rounded-lg w-full bg-richblack-700 border-b border-richblack-500'
            id='sectionName'
            placeholder='Add Section name'
            {...register("sectionName",{required:true})}
             />
             {
                errors.sectionName && (
                    <span>Section Name is Required</span>
                )
             }
        </div>
        <div className='mt-10 flex gap-2 my-2'>
          <IconButton
          type='Submit'
          text={ editSectionName ? 'Edit Section Name' : 'Create Section' }
          outline={true}
           >
            <MdAddCircleOutline />
          </IconButton>
          {
            editSectionName && (
              <button
              type='button'
              onClick={cancelEdit}
              className='text-sm text-richblack-300 underline' >Cancel Edit</button>
            )
          }
        </div>
      </form>

      {
        course.courseSchema?.length > 0 && (
          <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
        )
      }

    </div>
    <div className='flex gap-3 my-20'>
        <div className='flex gap-1 items-center bg-richblack-800 px-3 py-1 rounded-sm border-b border-r border-richblack-400'>
        <IoIosArrowBack />
        <button
        type='button'
        onClick={goBack}
        className='rounded-md cursor-pointer flex items-center' >Back</button>
        </div>
        <IconButton text='Next'
        onclick={gotoNext} >
          <IoIosArrowForward />
        </IconButton>
      </div>
    </>
  )
}

export default CourseBuilder
