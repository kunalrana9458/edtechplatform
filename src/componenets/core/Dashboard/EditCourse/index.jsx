import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {setCourse,setEditCourse} from '../../../../slices/courseSlice'
import { getFullDetailsOfCourse } from '../../../../services/operations/courses/coursesAPIs'
import { useParams } from 'react-router-dom'
import RenderSteps from '../AddCourse/RenderSteps'
import { useDispatch } from 'react-redux'

const EditCourse = () => {

    const {token} = useSelector((state) => state.auth)
    const {course} = useSelector((state) => state.course)
    const params = useParams()
    const [loading,setLoading] = useState(false)
    const dispatch = useDispatch()
    const courseId = params.id
    console.log(params.id)

    useEffect(() => {
        const fetchCourse = async() => {
            setLoading(true)
            const result = await getFullDetailsOfCourse(courseId,token)
            if(result){
                dispatch(setCourse(result))
                dispatch(setEditCourse(true))
            }
            setLoading(false)
            console.log("Course after calling fetch api",course)
        }
        fetchCourse();
    },[])

    if(loading){
        return <div className='text-5xl text-yellow-300 font-bold'>Loading...</div>
    }
    

  return (
    <div>
      <h1>Edit Course</h1>
      <div>
      {
        course ? (<RenderSteps />) : (<p>No Course Found</p> )
      }
      </div>
    </div>
  )
}

export default EditCourse
