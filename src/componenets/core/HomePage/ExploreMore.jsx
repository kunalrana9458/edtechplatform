import React, { useState } from 'react'
import {HomePageExplore} from '../../../data/homepage-explore'
import HighlightText from './HighlightText'
import CourseCard from './CourseCard'


const tabNames = [
    'Free',
    'New to coding',
    'Most popular',
    'Skills paths',
    'Career paths'
]

const ExploreMore = () => {

    const [currentTab,setCurrentTab] = useState(tabNames[0])
    const [courses,setCourses] = useState(HomePageExplore[0].courses)
    const [currentCard,setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyCard = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter((course) => course.tag === value)
        setCourses(result[0].courses)
        setCurrentCard(result[0].courses[0].heading)
    }


  return (
    <div className='flex flex-col items-center'>

      <div className='text-4xl font-semibold text-center'>
        Unlock the 
        <HighlightText text={"Power of Code"} />
      </div>
      
      <p className='text-center text-richblack-300 text-[1rem] font-medium mt-3'>
        Learn to Build anything you can imagine
      </p>

      <div className='mt-5 lg:flex-row lg:flex hidden rounded-full bg-richblack-800 mb-5 border-richblack-100 p-1'>
        {
            tabNames.map((element,index) => {
                return (
                    <div
                    className={`text-[1rem] flex flex-col gap-2
                    ${currentTab === element
                    ?  "bg-richblack-900 text-richblack-5 font-medium"
                    :  "text-richblack-200" } rounded-full transition-all
                    duration-200 cursor-pointer hover:ring-richblack-900 text-hover:ring-richblack-5 px-7 py-2`}
                    key={index}
                    onClick={() => setMyCard(element)}
                    >
                        {element}
                    </div>
                )
            })
        }


      </div>

      <div className='lg:h-[250px] h-[50px]'></div>

      {/* course card ka group  */}
      <div className='lg:absolute flex lg:flex-row flex-col gap-16 my-5 justify-between sm:w-[60%] lg:w-full lg:bottom-[-6.25%] bottom-[-35.25%]'>
        {
            courses.map((element,index) => {
                return (
                    <CourseCard
                    key={index}
                    cardData={element}
                    currentCard={currentCard}
                    setCurrentCard={setCurrentCard} />
                )
            })
        }
      </div>

    </div>
  )
}

export default ExploreMore
