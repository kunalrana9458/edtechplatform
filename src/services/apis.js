const BASE_URL = process.env.REACT_APP_BASE_URL

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
  // Profile Updates
  UPDATEDISPLAY_PICTURE: BASE_URL + "/profile/updateDisplayPicture",
  UPDATEPROFILE_DETAILS: BASE_URL + "/profile/updateProfile"
}


export const profileEndpoints = {
  GET_STUDENT_COURSE_DETAILS_API:BASE_URL + "/course/getStudentAllCourses",
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard"
}

export const categoryEndpoint = {
  GET_ALL_CATEGORIES:BASE_URL + "/course/showAllCategories"
}

export const courseEndpoints = {
  ADD_COURSE_API: BASE_URL + "/course/createCourse",
  EDIT_COURSE_API:BASE_URL + "/course/editCourse",
  GET_INSTRUCTOR_COURSE_API: BASE_URL + "/course/getInstructorCourses",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
  GET_FULL_COURSE_DETAILS_API: BASE_URL + "/course/getFullCourseDetails",
  GET_INDIVIDUAL_COURSE_DETAIL_API: BASE_URL + "/course/getCourseDetails",
}

export const sectionEndpoints = {
  UPDATE_SECTION_API : BASE_URL + "/course/updateSection",
  CREATE_SECTION_API : BASE_URL + "/course/addSection",
  DELETE_SECTION_API : BASE_URL + "/course/deleteSection"
}

export const subSectionEndpoints = {
  DELETE_SUBSECTION_API : BASE_URL + "/course/deleteSubSection",
  UPDATE_SUBSECTION_API : BASE_URL + "/course/updateSubSection",
  CREATE_SUBSECTION_API : BASE_URL + "/course/addSubSection",
  LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress"
}

export const catalogDataEndpoint = {
  CATALOGPAGEDATA_API: BASE_URL + "/course/getCategoryPageDetails"
}

export const studentPaymentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail"
}