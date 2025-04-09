import React, { useEffect, useState } from 'react'
import {useForm} from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import {toast} from 'react-hot-toast'
import { setCourse } from '../../../../../slices/courseSlice' 
import { createSubSection, updateSubSection } from '../../../../../services/operations/courses/coursesAPIs'
import {RxCross1, RxUpload} from 'react-icons/rx'
import Upload from  '../CourseInformation/Upload'
import IconButton from  '../../../../common/IconButton'


const SubSectionModal = ({
  modalData,
  setModalData,
  add=false,
  view=false,
  edit=false,
}) => {

  const {
    register,
    handleSubmit,
    setValue,
    formState:{errors},
    getValues
  } = useForm()

  const dispatch = useDispatch()
  const [loading,setLoading] = useState(false)
  const {course} = useSelector((state) => state.course)
  const {token} = useSelector((state) => state.auth)

  useEffect(() => {
    if(view || edit){
      setValue("lectureTitle",modalData.title)
      setValue("lectureDesc",modalData.description)
      setValue("lectureVideo",modalData.videoUrl)
    }
  },[])

  const isFormUpdated = () => {
    const currentValues = getValues()

    if(currentValues.lectureTitle !== modalData.title || 
       currentValues.lectureDescription !== modalData.description ||
       currentValues.lectureVideo !== modalData.videoUrl)
       return true;
    
    return false
  }

  const handleEditSubSection = async() => {
    const currentValues = getValues()
    const formData = new FormData()

    formData.append("sectionId",modalData.sectionId)
    formData.append("subSectionId",modalData._id)

    if(currentValues.lectureTitle !== modalData.title){
      formData.append("title",currentValues.lectureTitle)
    }

    if(currentValues.lectureDesc !== modalData.description){
      formData.append("description",currentValues.lectureDesc)
    }

    if(currentValues.lectureVideo !== modalData.video){
      formData.append("video",currentValues.lectureVideo)
    }

    setLoading(true)
    const result = await updateSubSection(formData,token)
    if(result){
      const updatedCourseContent = course.courseSchema.map((section) => (section._id === modalData.sectionId ? result : section))
      const updatedCourse = {...course,courseSchema:updatedCourseContent}
      dispatch(setCourse(updatedCourse)) 
    }
  }

  const onSubmit = async(data) => {
    if(view)
      return ;

    if(edit){
      if(!isFormUpdated){
        toast.error("No Changes made to the form")
      }
      else{
        // edit krdo
        handleEditSubSection()
      }
      return ;
    }

    const formData = new FormData()
    formData.append("sectionId",modalData)
    formData.append("title",data.lectureTitle)
    formData.append("description",data.lectureDesc)
    formData.append("video",data.lectureVideo)

    setLoading(true)
    // API CALL
    const result = await createSubSection(formData,token)

    if(result){
      const updatedCourseContent = course.courseSchema.map((section) => (section._id === modalData) ? result : section)
      const updatedCourse = {...course,courseSchema:updatedCourseContent}
      dispatch(setCourse(updatedCourse))
    }
    setModalData(null)
    setLoading(false)

  }

  return (
    <div className='flex gap-y-8 bg-richblack-700 lg:max-w-[800px] w-11/12 mx-auto mt-2 rounded-xl'>

    <div className='bg-richblack-800  rounded-xl w-full'>
      <div className='bg-richblack-700 flex justify-between p-4 rounded-t-xl'>
        <p className='text-xl' > {view && "Viewing " } {add && "Adding "} {edit && "Editing" } </p>
        <button
        onClick={() => (!loading && setModalData(null) )} >
          <RxCross1 className='font-bold'  />
        </button>
      </div>

      <form
      className='mt-8 p-6 flex flex-col gap-y-4'
      onSubmit={handleSubmit(onSubmit)}>
         <Upload
         name="lectureVideo"
         label="Lecture Video"
         register={register}
         setValue={setValue}
         errors={errors}
         video={true}
         viewData={view ? modalData.videoUrl:null }
         editData={edit ? modalData.videoUrl:null }
          />

          <div className='flex flex-col gap-y-2'>
            <label htmlFor="lectureTitle">Lecture Title <span className='text-pink-500'>*</span> </label>
            <input
            id='lectureTitle'
            type="text"
            placeholder='Enter Lecture Title'
            {...register("lectureTitle",{required:true})}
            className='w-full p-2 bg-richblack-700 rounded-lg' />
            {
              errors.lectureTitle && (
                <span>
                  Lecture Title is required
                </span>
              )
            }
          </div>

          <div className='flex flex-col gap-y-2'>
            <label htmlFor="lectureDesc">Lecture Title is Required <span className='text-pink-500'>*</span> </label>
            <textarea name="" 
            id="lectureDesc"
            placeholder='Enter Lecture Description'
            {...register("lectureDesc",{required:true})}
            className='w-full min-h-[130px] p-2 rounded-lg bg-richblack-700' />
            {
              errors.lectureDesc && (
                <span>Lecture Descripition is Required</span>
              )
            }
          </div>

          {
            !view && (
              <div>
                <IconButton
                text={loading ? "Loading..." : edit ? "Save Changes" : "Save"} />
              </div>
            )
          }

      </form>

    </div>

    </div>
  )
}

export default SubSectionModal
