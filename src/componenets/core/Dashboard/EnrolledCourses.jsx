import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../../../services/operations/profileAPIs'
import ProgressBar from '@ramonak/react-progress-bar'
import { useNavigate } from 'react-router-dom'

const EnrolledCourses = () => {

    const {token} = useSelector((state) => state.auth)
    const [enrolledCourses,setEnrolledCourses] = useState(null);
    const navigate = useNavigate()

    const getEnrolledCourses = async() => {
        try {
            const response = await getUserEnrolledCourses(token);
            console.log(response)
            setEnrolledCourses(response)
        } catch (error) {
            console.log("Unable To Fetch Enrolled Courses")
        }
    }

    useEffect(() => {
        getEnrolledCourses();
    },[])

  return (
    <div className=''>
    <div className='text-richblack-100'> Home / {"  "} Dashboard / {"  "}<span className='text-yellow-50'>Enrolled Courses</span> </div>
      <div className='text-4xl text-richblack-25 my-6'>
        Enrolled Courses
      </div>
      {
        !enrolledCourses ? (
            <div>
                Loading...
            </div>
        ) : 
        !enrolledCourses.length ? (<p>You Have Not Enrolled in any course Yet!</p>)
        : (
            <table className='border border-richblack-600 p-4 w-full'>
                <thead className='bg-richblack-800 p-12 rounded-lg'>
                    <td className='p-4 text-richblack-50 w-[60%]'>Course Name</td>
                    <td className='p-4 text-richblack-50'>Duration</td>
                    <td className='p-4 text-richblack-50'>Progress</td>
                </thead>
                {/* cards start from here   */}
                {
                    enrolledCourses.map((course,index) => (
                        <tr key={index} 
                        >
                            <td
                            className='p-4 flex items-center gap-x-4'
                            onClick={() => navigate(`/view-course/${course?._id}/section/${course?.courseSchema?.[0]?._id}/sub-section/${course?.courseSchema?.[0]?.
                            subSection?.[0]?._id}`)}>
                                <img
                                height={80}
                                width={80}
                                className='rounded-md object-cover'
                                src={course.thumbnail}
                                />
                                <div>
                                    <p className='text-sm text-richblack-25'> {course.courseName} </p>
                                    <p className='text-sm text-richblack-200 w-[80%]'> {course.courseDescription} </p>
                                </div>
                            </td>
                            <td className='text-richblack-50 mx-4'>
                                {
                                    course?.totalDuration || "2hr 30 mins"
                                }
                            </td>
                            <td className='px-4'>
                                <p className='text-richblack-50'> Progress: {course.progressPercentage || 0} </p>
                                <ProgressBar
                                completed={course.progressPercentage || 0}
                                height='8px'
                                isLabelVisible={false} />
                            </td>
                        </tr>
                    ))
                }
            </table>
        )
      }
    </div>
  )
}

export default EnrolledCourses
