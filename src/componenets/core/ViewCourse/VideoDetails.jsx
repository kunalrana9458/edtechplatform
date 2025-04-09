import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { markLectureAsComplete } from '../../../services/operations/courses/coursesAPIs'
import { updateCompletedLectures } from '../../../slices/ViewCourselice'
import {Player} from 'video-react'
import 'video-react/dist/video-react.css'
import {AiFillPlayCircle} from 'react-icons/ai'
import IconButton from '../../common/IconButton'

const VideoDetails = () => {

    const {courseId,sectionId,subSectionId} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const playRef = useRef((state) => state.auth)
    const location = useLocation()
    const {token} = useSelector((state) => state.auth)
    const {courseSectionData,courseEntireData,completedLectures} = useSelector((state) => state.viewCourse)

    const [videoData,setVideoData] = useState([])
    const [videoEnded,setVideoEnded] = useState(false)
    const [loading,setLoading] = useState(false)

    useEffect(() => {
        const setVideoSpecificDetails = async() => {
            if(!courseSectionData.length)
                return ;
            if(!courseId && !sectionId && !subSectionId){
                navigate("/dashboard/enrolled-courses")
                return ;
            }
            else{
                const filteredData = courseSectionData?.filter((section) => section._id === sectionId)
                const filteredVideo = filteredData?.[0]?.subSection?.filter((data) => data._id === subSectionId)
                setVideoData(filteredVideo[0])
                setVideoEnded(false)
            }
        }
        setVideoSpecificDetails()
    },[courseSectionData,courseEntireData,location.pathname])


    const isFirstVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId)
        const currentSubSectionIndex = courseSectionData?.[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId)

        if(currentSectionIndex === 0 && currentSubSectionIndex === 0){
            return true
        }
        return false
    }

    const isLastVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId)
        const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.findIndex((data) => data._id === subSectionId)

        const noOfSubSection = courseSectionData[currentSectionIndex].subSection.length

        if(currentSectionIndex === courseSectionData.length-1 && currentSubSectionIndex === noOfSubSection - 1)
            return true

        return false
    }

    const goToNextVideo = () => {
        const currentSectionIndex = courseSectionData?.findIndex((data) => data._id === sectionId)
        const noOfSubSection = courseSectionData[currentSectionIndex]?.subSection?.length
        const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection?.findIndex((data) => data._id === subSectionId)
        if(currentSubSectionIndex !== noOfSubSection-1){
            // same section ki next video mai jana hai
            const nextSubSectionId = courseSectionData[currentSectionIndex]?.subSection[currentSubSectionIndex+1]._id
            // go to next video
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
        }

        // different section ki first video
        else{
            const nextSectionId = courseSectionData[currentSectionIndex+1]._id
            const nextSubSectionId = courseSectionData[currentSectionIndex+1].subSection[0]._id
            // navigate to the next video
            navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)
        }
    }

    const goToPreviousVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id)
        const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection?.findIndex((data) => data._id === subSectionId)
        const noOfSubSection = currentSectionIndex?.[currentSectionIndex]?.subSection?.length

        if(currentSubSectionIndex === 0){
            const prevSectionId = courseSectionData[currentSectionIndex-1]._id
            const prevSubSectionId = courseSectionData[currentSectionIndex-1]?.subSection[noOfSubSection-1]

            // now navigate to that video 
            navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`)
        }

        else{
            const prevSubSectionId = courseSectionData[currentSectionIndex]?.subSection[currentSubSectionIndex-1]._id
            // now navigate to that subsection 
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`)
        }
    }

    const handleLectureCompletion = async() => {
        /// dummy code, baad me wewill code it
        setLoading(true)
        const res = await markLectureAsComplete({courseId:courseId,subSectionId:subSectionId},token)
        if(res){
            dispatch(updateCompletedLectures(subSectionId))
        }
        setLoading(false )
    }



  return (
    <div className='text-white'>
         {
            !videoData ? (
                <div> No Video Found </div>
            ) : 
            (
                <Player
                ref={playRef}
                playsInline
                onEnded={() => setVideoEnded(true)}
                src={videoData?.videoUrl} >
                    <AiFillPlayCircle
                     fluid="true" />
                     {
                        videoEnded && (
                            <div>
                                {
                                    !completedLectures?.includes(subSectionId) && (
                                        <IconButton
                                        disabled={loading}
                                        onclick={() => handleLectureCompletion()}
                                        text={!loading ? "Mark As Completed" : "Loading..."} />
                                    )
                                }

                                <IconButton 
                                    disabled={loading}
                                    onclick={() => {
                                        if(playRef?.current){
                                            playRef?.current.seek(0)
                                            setVideoEnded(false)
                                        }
                                    }}
                                    text='Rewatch'
                                    customClasses='text-xl'
                                />

                                <div>
                                    {!isFirstVideo() && (
                                        <button
                                        disabled={loading}
                                        onClick={goToPreviousVideo}
                                        className='blackButton' >
                                            Prev
                                        </button>
                                    ) }
                                    {
                                        !isLastVideo() && (
                                            <button
                                             disabled={loading}
                                        onClick={goToNextVideo}
                                        className='blackButton' >
                                                Next
                                            </button>
                                        )
                                    }
                                </div>
                            </div>
                        )
                     }
                </Player>
            )
         }
         <h1>
            {videoData?.title}
         </h1>
         <p>
            {videoData?.description }
         </p>
    </div>
  )
}

export default VideoDetails
                                   