import React, { useEffect, useState } from 'react'
import {buyCourse} from '../services/operations/studentFeatureAPI'
import { useDispatch, useSelector } from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'
import {fetchCourseDetails} from '../services/operations/courses/coursesAPIs'
import GetAvgRating from '../utils/avgRating'
import ConfirmationModal from '../componenets/common/ConfirmationModal'
import RatingStars from '../componenets/common/RatingStars'
import { formatDate } from '../services/formatDate'
import CourseDetailsCard from '../componenets/core/Course/CourseDetailsCard'


const CourseDetails = () => {

  
    const {token} = useSelector((state) => state.auth)
    const {user} = useSelector((state) => state.profile)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {courseId} = useParams()
    const [courseData,setCourseData] = useState(null)
    const {loading} = useSelector((state) => state.auth)
    const {paymentLoading} = useSelector((state) => state.course)
    const [confirmationModal,setConfirmationModal] = useState(null)

    useEffect(() => {
      const getCourseFullDetails = async() => {
        try {
          const result = await fetchCourseDetails(courseId)
          if(result){
            setCourseData(result[0])  
          }
        } catch (error) {
          console.log("Error in fetching course Details") 
        }
      }
      getCourseFullDetails()
    },[courseId])

    const [avgReviewCount,setAverageReviewCount] = useState(0)
    const [totalNumberOfLecture,setTotalNoOfLecture] = useState(0)

    useEffect(() => {
      let lectures = 0

      if(courseData){
        courseData?.courseSchema?.forEach((sec) => {
        lectures += sec.subSection.length || 0
      })
      setTotalNoOfLecture(lectures)
      }

    },[courseData])

    useEffect(() => {
      const count = GetAvgRating(courseData?.ratingAndReviews)
      setAverageReviewCount(count)
    },[courseData])

    // to update
    const handleBuyCourse = () => {
        console.log(token)
        console.log("Buy Now Button called")
        if(token){
            console.log("BUY COURSE CALLED")
            buyCourse(token,[courseId],user,navigate,dispatch)
        }
        else{
          setConfirmationModal({
            text1:"You are Not Logged in",
            text2:"Please login to purchase the course",
            btn1Text:"Login",
            btn2Text:"Cancel",
            btn1Handler:() => navigate("/login"),
            btn2Handler:() => setConfirmationModal(null)
          })
        }
    }

    if(loading || !courseData){
      return <div className='text-4xl text-yellow-100'> Loading...... </div>
    }

    if(courseData){
    }

    const {
      _id,
      courseName,
      courseDescription,
      thumbnail,
      price,
      whatYouWillLearn,
      courseSchema,
      ratingAndReviews,
      instructor,
      studentEnrolled,
      createdAt
    } = courseData



    const splitWhatYouWillLearn = whatYouWillLearn.split(',')

  return (
    <div className='flex flex-col'>
    <div className='relative flex flex-col justify-start gap-y-3 px-24 py-12 bg-richblack-800
    border-richblack-700'>
    <div className='text-richblack-300'> Home / {" "}  Learning {" "} / <span className='text-yellow-50'>Python</span> </div>
    <p
    className='text-richblack-5 text-3xl'> {courseName} </p>
      <p 
      className='text-richblack-200 text-[1rem]'> {courseDescription} </p>
      <div className='flex gap-x-2 items-center'>
        <span className='text-yellow-50'> {avgReviewCount} </span>
        <RatingStars Review_count={avgReviewCount} star_size={24} />
        <span className='text-richblack-100'> {`(${ratingAndReviews.length} reviews)`} </span>
        <span className='text-richblack-100'> {`(${studentEnrolled.length} students Enrolled)`} </span>
      </div>

      <div className='text-richblack-100'>
        <p> Created by {`${instructor?.firstName}`} </p>
      </div>

      <div className='flex gap-x-3 text-richblack-50'>
        <p>
          Created At {formatDate(createdAt)}
        </p>
        <p>
          {" "} English
        </p>
      </div>

      <div className='absolute bg-richblack-700 right-24 top-12'>
        <CourseDetailsCard 
         course={courseData}
         setConfirmationModal={setConfirmationModal}
         handleBuyCourse={handleBuyCourse} />
      </div>

    </div>

    <div className='w-[55%] my-8 mx-24 border-richblack-700 border
    p-4'>
      <p className='text-3xl text-richblack-5 mb-6'>What You'll Learn</p>
      <div className='flex flex-col gap-y-2 text-richblack-50'>
        {
          splitWhatYouWillLearn.map((part,index) => (
            <div key={index}>
              {part} 
            </div>
          ))
        }
      </div>
    </div>

    <div className='flex flex-col gap-y-3 w-[55%] my-8 mx-24 p-4'>
      <div>
        <p className='text-richblack-5 text-3xl'>Course Content</p>
      </div>
      <div className='flex gap-x-3 text-richblack-100'>
        <span>{courseSchema.length} sections</span>
         <span> . {totalNumberOfLecture} lectures </span> 
         <span> . {courseData?.duration || "4h 57min"} </span>       
      </div>
      <div>
        
      </div>
    </div>

      {confirmationModal && (
              <>
                {/* Blur Background */}
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"></div>
      
                {/* Centered Modal */}
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <ConfirmationModal modalData={confirmationModal} />
                </div>
              </>
            )}
    </div>
  )
}

export default CourseDetails
