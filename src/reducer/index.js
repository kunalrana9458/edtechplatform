import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '../slices/authSlice'
import profileReducer from '../slices/profileSlice'
import courseReducer from '../slices/courseSlice'
import courseCartReducer from '../slices/courseCartSlice'
import viewCourseReducer from '../slices/ViewCourselice'


const rootReducer = combineReducers({
    auth:authReducer,
    profile:profileReducer,
    cart:courseCartReducer,
    course:courseReducer,
    viewCourse:viewCourseReducer,
})

export default rootReducer 