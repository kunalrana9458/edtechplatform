import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getInstructorCourses } from '../../../../services/operations/courses/coursesAPIs'
import { getInstructorData } from '../../../../services/operations/profileAPIs'
import { Link } from 'react-router-dom'
import InstructorChart from './InstructorChart'


const Instructor = () => {

    const {token} = useSelector((state) => state.auth)
    const {user} = useSelector((state) => state.profile)
    const [loading,setLoading] = useState(false)
    const [instructorData,setInstructorData] = useState(null)
    const [courses,setCourses] = useState([]);

    useEffect(() => {
        const getCourseDataWithStats = async() => {
            setLoading(true)
            // pending
            const instructorApiData = await getInstructorData(token);
            const result = await getInstructorCourses(token);

            console.log("Instructoe API DATA:",instructorApiData)

            if(instructorApiData?.length){
                setInstructorData(instructorApiData)
            }

            if(result){
                setCourses(result)
            }
            setLoading(false)
        }
        getCourseDataWithStats()
    },[])

    const totalAmount = instructorData?.reduce((acc,curr) => acc+curr.totalAmountGenerated,0)
    const totalStudents = instructorData?.reduce((acc,curr) => acc+curr.totalStudentsEnrolled,0)

  return (
    <div className='text-white'>
      <div>
        <h1> Hi {user?.firstName} </h1>
        <p>Let's start Something New</p>
      </div>

      {
        loading ? (<div>Loading...</div>) :
        (
            <div>
                <div>
                    <InstructorChart courses={instructorData} />
                    <div>
                        <p> Statitics </p>
                        <div>
                            <p> Total Courses </p>
                            <p> {courses.length} </p>
                        </div>
                        <div>
                            <p>Total Students</p>
                            <p> {totalStudents} </p>
                        </div>
                        <div>
                            <p> Total Income </p>
                            <p> {totalAmount} </p>
                        </div>
                    </div>
                </div>
                <div>
                    {/* Render 3 courses  */}
                    <div>
                        <p>Your Courses</p>
                        <Link to="/dashboard/my-courses">
                           <p> View All  </p>
                        </Link>
                        <div>
                            {
                                courses.slice(0,3).map((course,index) => (
                                    <div key={index}>
                                        <img
                                        src={course.thumbnail} alt="" />
                                        <div>
                                            <p> {course.courseName} </p>
                                            <div>
                                                <p> {course?.studentsEnrolled?.length} </p>
                                                <p> | </p>
                                                <p> Rs {course.price} </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
      }
    </div>
  )
}

export default Instructor
