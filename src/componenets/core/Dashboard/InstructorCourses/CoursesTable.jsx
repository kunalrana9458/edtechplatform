import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Table, Th, Tr, Thead, Tbody, Td } from "react-super-responsive-table";
import { FaCheck, FaCircle, FaCircleCheck, FaRegClock } from "react-icons/fa6";
import { SiTicktick } from "react-icons/si";
import { COURSE_STATUS } from "../../../../utils/constants";
import { MdDelete, MdEdit } from "react-icons/md";
import ConfirmationModal from "../../../common/ConfirmationModal";
import {
  deleteInstructorCourse,
  getInstructorCourses,
} from "../../../../services/operations/courses/coursesAPIs";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { useNavigate } from "react-router-dom";



const CoursesTable = ({ courses, setCourses }) => {
  // const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const navigate = useNavigate()
  const TRUNCATE_LENGTH = 30

  const handleCourseDelete = async (courseId) => {
    setLoading(true);
    await deleteInstructorCourse({ courseId: courseId }, token);
    const result = await getInstructorCourses(token);
    if (result) {
      setCourses(result);
    }
    setConfirmationModal(null);
    setLoading(false);
  };

  return (
    <div>
      <Table className="border border-richblack-800 rounded-xl">
        <Thead>
          <Tr className="flex gap-x-10 rounded-t-lg border-b border-b-richblack-800 px-6 py-2">
            <Th className="flex-1 text-left text-sm uppercase text-richblack-200 font-medium">Courses</Th>
            <Th className="text-left text-sm uppercase text-richblack-200 font-medium">Duration</Th>
            <Th className="text-left text-sm uppercase text-richblack-200 font-medium">Price</Th>
            <Th className="text-left text-sm uppercase text-richblack-200 font-medium">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {courses.length === 0 ? (
            <Tr>
              <Td>No Courses Found</Td>
            </Tr>
          ) : (
            courses?.map((course) => (
              <Tr
                key={course._id}
                className="flex gap-x-10 border-b border-richblack-800 px-6 py-8"
              > 
                <Td className="flex gap-x-4
                 flex-1 max-w-[647px]">
                  <img
                    src={course.thumbnail}
                    alt=""
                    className="h-[150px] w-[220px] rounded-lg object-cover"
                  />
                  <div className="flex flex-col justify-between">
                    <p className="text-lg font-semibold text-richblack-5">{course.courseName}</p>
                    <p className="text-xs text-richblack-300">{course.courseDescription.split(" ").length >
                      TRUNCATE_LENGTH
                        ? course.courseDescription
                            .split(" ")
                            .slice(0, TRUNCATE_LENGTH)
                            .join(" ") + "..."
                        : course.courseDescription}</p>
                    <p className="text-[12px] text-white"> Created: </p>
                    {course.status === COURSE_STATUS.DRAFT ? (
                      <div className="flex gap-x-2 items-center bg-richblack-700 w-fit p-2 px-4 rounded-full text-pink-700">
                        <FaRegClock size={8} />
                        <p className="text-sm">DRAFT</p>
                      </div>
                    ) : (
                      <div className="flex gap-x-2 items-center bg-richblack-700 w-fit rounded-full p-2 px-4 text-yellow-50">
                        <FaCircleCheck size={18}  />
                        <p className="text-sm">PUBLISHED</p>
                      </div>
                    )}
                  </div>
                </Td>

                <Td className=''>2hr 30min</Td>

                <Td className="ml-2 text-sm font-medium text-richblack-100">₹{course.price}</Td>

                <Td className="ml-2">
                  <button 
                  disabled={loading}
                  className="px-1 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-400"
                  onClick={() => navigate(`/dashboard/add-course/${course._id}`)} >
                    <MdEdit size={20} />
                  </button>
                  <button
                    disabled={loading}
                    type="button"
                    className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                    onClick={() => {
                      console.log("Delete Clicked");
                      setConfirmationModal({
                        text1: "Do You Want to delete this Course",
                        text2: "All the data to this course will be deleted",
                        btn1Text: "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: !loading
                          ? () => handleCourseDelete(course._id)
                          : () => {
                              console.log("HII");
                            },
                        btn2Handler: !loading
                          ? () => {
                              setConfirmationModal(null);
                            }
                          : () => {
                              console.log("Loading");
                            },
                      });
                    }}
                  >
                    <MdDelete size={20} />
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
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
  );
};

export default CoursesTable;
