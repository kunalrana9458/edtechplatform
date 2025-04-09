import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import IconButton from '../../common/IconButton'

const VideoDetailsSideBar = ({setReviewModal}) => {

    const [activeStatus,setActiveStatus] = useState("")
    const [videoBarActive,setVideoBarActive] = useState("")
    const navigate = useNavigate()
    const location = useLocation()
    const {sectionId,subSectionId} = useParams()

    const {courseSectionData,
           courseEntireData,
           completedLectures,
           totalNoOfLectures,
    } = useSelector((state) => state.viewCourse)

    console.log("Course Entire data is:",courseEntireData)
    
    useEffect(() => {
      ;(() => {
        if(!courseSectionData.length){
          return  
        }
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId)
        const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.findIndex(
                                                          (data) => data._id === subSectionId
        )
        const activeSubSectionId = courseSectionData[currentSectionIndex]?.subSection?.[currentSubSectionIndex]?._id
        // set current section here
        setActiveStatus(courseSectionData?.[currentSectionIndex]?._id)
        // set current sub-section here
        setVideoBarActive(activeSubSectionId);
      })()
    },[courseSectionData,courseEntireData,location.pathname])

  return (
    <>
      <div className='text-white'>
      {/* for buttons and headings */}
        <div>
          {/* for buttons  */}
          <div>
            <div onClick={() => navigate("/dashboard/enrolled-courses")}>
              Back
            </div>

            <div>
              <IconButton
              text="Add Review"
              onClick={() => setReviewModal(true)} />
            </div>

          </div>
          {/* for heading or title  */}
          <div>
            <p> {courseEntireData?.courseName} </p>
            <p> {completedLectures?.length} / {totalNoOfLectures} </p>
          </div>
        </div>

        {/* for sections and subsections  */}
        <div>
          {
            courseSectionData?.map((section,index) => (
              <div
              onClick={() => setActiveStatus(section?._id)}
              key={index}
              >
                
                <div>
                  <div>
                    {section?.sectionName}
                  </div>
                  {/* HW :-: ADD ARROW ICON HERE AND HANDLE ROTATE LOGIC */}
                </div>
                {/* subsection  */}
                <div>
                  {
                    activeStatus === section?._id && (
                      <div>
                        {
                          section?.subSection?.map((topic,idx) => (
                            <div
                            key={idx}
                            className={`flex gap-4 p-5 
                            ${videoBarActive === topic?._id ? "bg-yellow-200 text-richblack-900" : "bg-richblack-900 text-white" } `}
                            onClick={() => {
                              navigate(`/view-course/${courseEntireData._id}/section/${section?._id}/sub-section/${topic._id}`)
                              setVideoBarActive(topic?._id)
                            }} >
                              <input
                              type='checkbox'
                              checked={completedLectures?.includes(topic?._id)}
                              onChange={() => {}} />
                              <span>
                                {topic?.title}
                              </span>
                            </div>
                          ))
                        }
                      </div>
                    )
                  }
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default VideoDetailsSideBar
