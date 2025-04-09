import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getInstructorCourses } from "../../../services/operations/courses/coursesAPIs";
import { useNavigate } from "react-router-dom";
import IconButton from "../../common/IconButton";
import {AiOutlinePlus} from 'react-icons/ai'
import CoursesTable from "./InstructorCourses/CoursesTable";
import { CiCirclePlus } from "react-icons/ci";

const MyCourses = () => {

  const [courses, setCourses] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate()
  const [loading,setLoading] = useState(false)

  useEffect(() => {
    const fetchCourses = async() => {
    setLoading(true)
    const result = await getInstructorCourses(token);
    if(result){
        setCourses(result);
    }
    setLoading(false)
    }
    fetchCourses()
  }, []);


  
  if(loading){
    return(
        <div className="text-5xl text-pink-900">Loading...</div>
    )
  }

  console.log(courses);

  return (
    <div className="text-white flex flex-col gap-4">
    <p className="text-richblack-300"> Home / Dashboard / <span className="text-yellow-100">  Courses</span> </p>
      <div className="flex justify-between">
        <h1 className="text-[2rem]">My Courses</h1>
        <IconButton
        text="New"
        onclick={() => navigate("/dashboard/add-course")} >
            <CiCirclePlus className="text-[1.5rem] font-bold "/>
        </IconButton>
      </div>

      {
        courses && <CoursesTable courses={courses} setCourses={setCourses} />
      }

    </div>
  );
};

export default MyCourses;
