import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useParams } from 'react-router-dom'
import { getFullDetailsOfCourse } from '../services/operations/courses/coursesAPIs'
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slices/ViewCourselice'
import VideoDetailsSideBar from '../componenets/core/ViewCourse/VideoDetailsSideBar'
import CourseReviewModal from '../componenets/core/ViewCourse/CourseReviewModal'
import {getUserEnrolledCourses} from '../services/operations/profileAPIs'

const ViewCourse = () => {

    const [reviewModal,setReviewModal] = useState(false)
    const {courseId} = useParams()
    const {token} = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    useEffect(() => {
        const setCourseSpecificDetails = async() => {
            const courseData = await getFullDetailsOfCourse(courseId,token)
            dispatch(setCourseSectionData(courseData?.courseDetails?.courseSchema))
            dispatch(setEntireCourseData(courseData?.courseDetails))
            dispatch(setCompletedLectures(courseData?.courseDetails?.completedVideos))
            let lectures = 0
            courseData?.data?.courseSchema?.forEach((sec) => {
                lectures += sec.subSection.length
            })
            dispatch(setTotalNoOfLectures(lectures))
        }
        setCourseSpecificDetails()
    },[])
 
  return (
    <>
        <div className='relative flex min-h-[calc(100vh-3.5rem)]'>
            <VideoDetailsSideBar 
            setReviewModal={setReviewModal}
            />
            <div>
                <Outlet />
            </div>
        </div>
        {
            reviewModal && (<CourseReviewModal setReviewModal={setReviewModal} />)
        }
    </>
  )
}

export default ViewCourse
