import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "../../../../common/IconButton";  
import { resetCourseState, setStep } from "../../../../../slices/courseSlice";
import { COURSE_STATUS } from "../../../../../utils/constants";
import { editCourseDetails } from "../../../../../services/operations/courses/coursesAPIs";
import {useNavigate} from 'react-router-dom'

const PublishCourse = () => {
  const { register, handleSubmit, setValue, getValues } = useForm();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const goBack = () => {
    dispatch(setStep(2))
  }

  const goToCourses = () => {
    dispatch(resetCourseState())
    navigate("/dashboard/my-courses")
  }

  if(loading){
    <div>Loading....</div>
  }

  const handleCoursePublish = async() => {
    if(course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true || (course.status === COURSE_STATUS.DRAFT && getValues("public") === false)){
        goToCourses()
        return ;
    }
    // if form updated
    const formData = new FormData()
    formData.append("courseId",course._id)
    const courseStatus = getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT
    formData.append("status",courseStatus)

    console.log(Object.fromEntries(formData.entries()))
    setLoading(true)
    const result = await editCourseDetails(formData,token)

    if(result){
        goToCourses()
    }
    setLoading(false)
  }

  const onSubmit = () => {
    console.log("Submit Function Called")
    handleCoursePublish()
  }

  return (
    <div className="rounded-md border-[1px] bg-richblack-800 p-6 border-richblack-700">
      <p>Publish Course</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="public">
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="rounded h-4 w-4 bg-richblack-900"
            />
            <span>Make this Course as Public</span>{" "}
          </label>
        </div>

        <div
        className="flex justify-end gap-x-3">
            <button
            type="button"
            disabled={loading}
            onClick={goBack}
            className="flex items-center rounded-md bg-richblack-400 p-4 text-black" >
              Back
            </button>
            <IconButton
            disabled={loading}
            text="Save Changes"
            />
        </div>

      </form>
    </div>
  );
};

export default PublishCourse;
