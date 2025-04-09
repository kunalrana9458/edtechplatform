import toast from "react-hot-toast";
import { apiconnector } from "../../apiconnector";
import {
  courseEndpoints,
  sectionEndpoints,
  subSectionEndpoints,
} from "../../apis";

const { 
  ADD_COURSE_API,EDIT_COURSE_API,
  GET_INSTRUCTOR_COURSE_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_API,
  GET_INDIVIDUAL_COURSE_DETAIL_API } = courseEndpoints;

const { UPDATE_SECTION_API, CREATE_SECTION_API, DELETE_SECTION_API } =
  sectionEndpoints;

const { DELETE_SUBSECTION_API,UPDATE_SUBSECTION_API,CREATE_SUBSECTION_API,LECTURE_COMPLETION_API } = subSectionEndpoints;


export const addCourseDetails = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  console.log(token);
  try {
    console.log("DATA................", data);
    const response = await apiconnector("POST", ADD_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorisation: `Bearer ${token}`,
    });
    console.log("CREATE COURSE API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Add Course Details");
    }
    toast.success("Course Details Added Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("CREATE COURSE API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const editCourseDetails = async (data,token) => {
  console.log("Edit course api called and data is::",Object.fromEntries(data.entries()));
  let result = null;
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiconnector("POST",EDIT_COURSE_API,data,{
      "content-Type": "multipart/form-data",
      Authorisation: `Bearer ${token}`
    })
    console.log("EDIT COURSE API RESPONSE............",response)
    if(!response?.data?.success){
      throw new Error("Could Not update Course Details")
    }
    toast.success("Course Details Updated Successfully")
    result = response?.data?.data
  } catch (error) {
    console.log("EDIT COURSE API ERROR..........",Error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
};

export const updateSection = async (data, token) => {
  let result = null;
  console.log("Update Section API hit");
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiconnector("POST", UPDATE_SECTION_API, data, {
      Authorisation: `Bearer ${token}`,
    });
    console.log("Update Section api response .....", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Update Section");
    }
    toast.success("Course Section Updated");
    result = response?.data?.data;
    console.log("UPDATE SECION RESULT", result);
  } catch (error) {
    console.log("UPDATE SECTION API ERROR......", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const createSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiconnector("POST", CREATE_SECTION_API, data, {
      Authorisation: `Bearer ${token}`,
    });
    console.log("CREATE SECTION API RESPONSE....", response);
    if (!response?.data?.success) {
      throw new Error("Error in section Creation");
    }
    toast.success("Section Created Successfully");
    result = response?.data?.updatedCourseDetails;
    console.log("Updated Course Details.........", result);
  } catch (error) {
    console("API ERROR OF SECTION CREATION...", error);
    toast.error("Error in Section Creation");
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiconnector("POST", DELETE_SECTION_API, data, {
      Authorisation: `Bearer ${token}`,
    });
    console.log("DELTED SECTION API CALL.....", response);
    if (!response?.data?.success) {
      throw new Error("Error in Section Deletion");
    }
    toast.success("Section Deleted Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("Error in section deletion API.....", error);
    toast.error("Error in Section Deletion");
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteSubSection = async (data, token) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {
    const response = await apiconnector("POST", DELETE_SUBSECTION_API, data, {
      Authorisation: `Bearer ${token}`,
    });
    console.log("DELETE SUBSECTION API CALLS....",response)
    if (!response.data.success) {
      throw new Error("Error in Deletion of SubSection");
    }
    toast.success("Sub Section Deleted Successfully")
    result = response?.data?.data
  } catch (error) {
    console.log("ERROR IN SUB SECTION DELETION API",error)
    toast.error("Error in Sub Section Deletion")
  }
  toast.dismiss(toastId)
  return result
};

export const createSubSection = async (data,token) => {
  console.log("Create Subsection data:::",Object.fromEntries(data.entries()))
  const toastId = toast.loading("Loading...")
  let result = null;
  try {
    const response = await apiconnector("POST",
      CREATE_SUBSECTION_API,
      data,
      {
        Authorisation: `Bearer ${token}`,
      }
    )
    if(!response.data.success){
      throw new Error("Error in Sub Section Creation")
    }
    toast.success("Sub Section Created Successfully")
    result = response?.data?.data
  } catch (error) {
    console.log("ERROR IN CREATE SUB SECTION API.....",error)
    toast.error("Error in Sub Section Creation");
  }
  toast.dismiss(toastId)
  return result
};

export const updateSubSection = async (data,token) => {
  const toastId = toast.loading("Loading...")
  let result = null;
  try {
    const response = await apiconnector("POST",UPDATE_SUBSECTION_API,
      data,
      {
        Authorisation: `Bearer ${token}`,
      }
    )
    if(!response.data.success){
      throw new Error("Error in the Sub Section Updation")
    }
    toast.success("Sub Section Updated Successfully")
    result = response?.data?.data
  } catch (error) {
    console.log("ERROR IN SUB SECTION UPDATION API......",error)
    toast.error("Error in Sub Section Updation") 
  }
  toast.dismiss(toastId)
  return result;
}


export const getInstructorCourses = async(token) => {
  const toastId = toast.loading("Loading...")
  let result = null;
  try {
    const response = await apiconnector("GET",GET_INSTRUCTOR_COURSE_API,null,
      {
        Authorisation: `Bearer ${token}`,
      }
    )
    if(!response?.data?.message){
      throw new Error("Error in the Fetching Instructor course")
    }
    console.log("INSTRUCTOR COURSES API REPONSE...",response)
    toast.success("Instructor Course Fetched Successfully")
    result = response?.data?.data
  } catch (error) {
    console.log("ERROR IN GET INSTRUCTOR COURSE API....",error)
    toast.error("Error in Fetching Instructor Course")
  }
  toast.dismiss(toastId)
  return result
}

export const deleteInstructorCourse = async(courseId,token) => {
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiconnector("POST",DELETE_COURSE_API,
      courseId,
      {
        Authorisation: `Bearer ${token}`,
      }
    )
    if(!response?.data?.success){
      throw new Error("Error in Course Deletion")
    }
    toast.success("Course Deleted Successfully")
  } catch (error) {
    console.log("Error in course Deletion API",error)
    toast.error("Error in Course Deletion") 
  }
  toast.dismiss(toastId)
}


// get full details of a course
export const getFullDetailsOfCourse = async (courseId, token) => {
  const toastId = toast.loading("Loading...")
  //   dispatch(setLoading(true));
  let result = null
  try {
    const response = await apiconnector(
      "POST",
      GET_FULL_COURSE_DETAILS_API,
      {
        courseId,
      },
      {
        Authorisation: `Bearer ${token}`,
      }
    )
    console.log("COURSE_FULL_DETAILS_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response?.data?.data
  } catch (error) {
    console.log("COURSE_FULL_DETAILS_API API ERROR............", error)
    result = error.response.data
    // toast.error(error.response.data.message);
  }
  toast.dismiss(toastId)
  //   dispatch(setLoading(false));
  return result
}

// get course details of a specific course when an student click on the particular course
export const fetchCourseDetails = async (courseId) => {
  const toastId = toast.loading("Loading...")
  let result = null;
  try {
    const response = await apiconnector(
      "POST",
      GET_INDIVIDUAL_COURSE_DETAIL_API,
      {
        courseId
      }
    )
    console.log("INDIVIDUAL COURSE DETAIL API RESPONSE......",response)
    if(!response.data.success){
      throw new Error("Error in fetching course Details")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("ERROR IN FETCHING INDIVIDUAL COURSE DETAILS......",error)
    toast.error("Error in fetching course Details")
  }
  toast.dismiss(toastId)
  return result
}

export const markLectureAsComplete = async(data,token) => {
  let result = null
  console.log("Mark complete data",data)
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiconnector("POST",LECTURE_COMPLETION_API,data,{
      Authorisation: `Bearer ${token}`
    })
    console.log("MARK_LECTURE_AS_COMPLETE_API_RESPONSE........",response)

    if(!response.data.message){
      throw new Error(response.data.error)
    }
    toast.success("Lecture Completed")
    result = true
  } catch (error) {
    console.log("ERROR_LECTURE_AS_COMPLETE_API_RESPONSE.........",error)
    toast.error("Error in Mark as Completed")
  }
  toast.dismiss(toastId)
  return result
}

export const createRating = async() => {
  
}