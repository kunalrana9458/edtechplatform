
import {toast} from 'react-hot-toast'
import {profileEndpoints} from '../apis'
import { apiconnector } from '../apiconnector'

const {GET_STUDENT_COURSE_DETAILS_API,
    GET_INSTRUCTOR_DATA_API
} = profileEndpoints

export async function getUserEnrolledCourses(token){
    const toastId = toast.loading("Loading...")
    let result = []
    try {
        const response = await apiconnector(
            "GET",
            GET_STUDENT_COURSE_DETAILS_API,
            null,
            {
                Authorisation:`Bearer ${token}`
            }
        )
        console.log("GET_USER_ENROLLED_COURSES_API_RESPONSE.....",response)
        if(!response.data.success){
            throw new Error(response.data.message)
        }
        result = response.data.data.courses
        toast.success("Course Fetched Successfully")
    } catch (error) {
        console.log("GET_USER_ENROLLED_COURSE_ERROR.....",error)
        toast.error("Could Not Get Courses")
    }
    toast.dismiss(toastId)
    return result
}

export async function getInstructorData(token) {
    const toastId = toast.loading("Loading...")
    let result = [];
    try {
        const response = await apiconnector("GET",GET_INSTRUCTOR_DATA_API,null,
            {
                Authorisation: `Bearer ${token}`
            }
        )
        console.log("GET_INSTRUCTOR_API_RESPONSE",response)
        result = response?.data?.courses
    } catch (error) {
        console.log("ERROR IN GET INSTRUCTOR ",error)
        toast.error("Could Not Get Instructor Data")
    }
    toast.dismiss(toastId)
    return result
}