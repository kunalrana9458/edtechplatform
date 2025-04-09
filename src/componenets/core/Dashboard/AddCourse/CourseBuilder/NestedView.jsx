import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxDropdownMenu } from "react-icons/rx";
import { MdEdit } from "react-icons/md";
import {  RiDeleteBin6Line } from "react-icons/ri";
import { BiSolidDownArrow } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import SubSectionModal from "./SubSectionModal";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import { deleteSection, deleteSubSection } from "../../../../../services/operations/courses/coursesAPIs";
import { setCourse } from "../../../../../slices/courseSlice";
import { AiOutlineBars } from "react-icons/ai";


const NestedView = ({ handleChangeEditSectionName }) => {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const [addSubSection, setAddSubSection] = useState(null);
  const [viewSubSection, setViewSubSection] = useState(null);
  const [editSubSection, setEditSubSection] = useState(null);

  const [confirmationModal, setConfirmationModal] = useState(null);

  console.log("COURSE IS.....", course);
  console.log(course?.courseSchema);

  const handleDeleteSection = async (sectionId) => {
    const result = await deleteSection({
      sectionId,
      courseId:course._id,
      token
    })
    if(result){
      dispatch(setCourse(result))
    }
    setConfirmationModal(null)
  };

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result = await deleteSubSection({subSectionId,sectionId},token)
    if(result){
      const updatedCourseContent = course.courseSchema.map((section) => (section._id === sectionId ? result : section))
      const updatedCourse = {...course,courseSchema:updatedCourseContent}
      dispatch(setCourse(updatedCourse))
    }
    setConfirmationModal(null)     
  };

  return (
    <div className="relative">
      <div className="rounded-lg bg-richblack-700 p-6 px-4">
        {course?.courseSchema?.map((section) => (
          <details key={section._id} open>
            <summary className="flex items-center justify-between gap-x-3  border-b-2 border-yellow-50">
              <div className="flex items-center gap-x-3 my-2">
                <AiOutlineBars />
                <p> {section.sectionName} </p>
              </div>
              <div className="flex items-center gap-x-3">
                <button
                  onClick={() =>
                    handleChangeEditSectionName(
                      section._id,
                      section.sectionName
                    )
                  }
                >
                  <MdEdit />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setConfirmationModal({
                      text1: "Delete this Section",
                      text2: "All the lectures in this section will be deleted",
                      btn1Text: "Delete ",
                      btn2Text: "Cancel",
                      btn1Handler: () => handleDeleteSection(section._id),
                      btn2Handler: () => setConfirmationModal(null),
                    })
                  }
                >
                  <RiDeleteBin6Line />
                </button>
                <span>|</span>
                <BiSolidDownArrow className="pointer" />
              </div>
            </summary>

            <div>
              {section?.subSection.map((data) => {
                return (
                  <div
                    key={data._id}
                    onClick={() => setViewSubSection(data)}
                    className="flex items-center justify-between gap-x-3 border-b-2 border-yellow-50"
                  >
                    <div className="flex items-center gap-x-3 ml-3 my-1">
                      <AiOutlineBars />
                      <p> {data.title} </p>
                    </div>

                    <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-x-3">
                      <button
                        onClick={() =>
                          setEditSubSection({...data, sectionId: section._id })
                        }
                      >
                        <MdEdit />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmationModal({
                            text1: "Delete this SubSection",
                            text2: "Selected Lecture will be Deleted",
                            btn1Text: "Delete",
                            btn2Text: "Cancel",
                            btn1Handler: () =>
                              handleDeleteSubSection(data._id, section._id),
                            btn2Handler: () => setConfirmationModal(null),
                          })
                        }
                      >
                        <RiDeleteBin6Line />
                      </button>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={() => setAddSubSection(section._id)}
                className="mt-4 flex items-center gap-x-2 text-yellow-50"
              >
                <AiOutlinePlus />
                <p>Add Lecture</p>
              </button>
            </div>
          </details>
        ))}
      </div>
      {addSubSection ? (
        <>
        {/* <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"></div> */}

        {/* <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"> */}
        <SubSectionModal
          modalData={addSubSection}
          setModalData={setAddSubSection}
          add={true}
        />
        {/* </div> */}
        </>
      ) : viewSubSection ? (
        <>
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"></div>

        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40">

        <SubSectionModal
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          view={true}
        />
        </div>
        </>
      ) : editSubSection ? (
        <>
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"></div>
        <div>

        <SubSectionModal
          modalData={editSubSection}
          setModalData={setEditSubSection}
          edit={true}
        />
        </div>
        </>
      ) : (
        <div></div>
      )}
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

export default NestedView;
