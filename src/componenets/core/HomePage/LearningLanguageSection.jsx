import React from 'react'
import HighlightText from './HighlightText'
import knowYourProgress from '../../../assets/Images/Know_your_progress.png'
import compareWithOthers from '../../../assets/Images/Compare_with_others.png'
import planYourLesson from '../../../assets/Images/Plan_your_lessons.png'
import CTAButton from './CTAButton'

const LearningLanguageSection = () => {
  return (
    <div className='mt-40 mb-32'>
      <div className='flex flex-col gap-5 items-center'>
        <div className='text-4xl text-center font-semibold '>
            Your Swiss Knife for 
            <HighlightText text={"learning any language"} />
        </div>

        <div className='text-center text-richblack-600 mx-auto font-medium w-full lg:w-[70%]'>
          Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
        </div>

        <div className='flex flex-col lg:flex-row items-center justify-center mt-5'>
           <img
           src={knowYourProgress}
           alt=""
           className='object-contain lg:-mr-40' />
           <img
           src={compareWithOthers}
           alt=""
           className='object-contain -mt-20'/>
           <img
           src={planYourLesson}
           alt=""
           className='object-contain lg:-ml-40 -mt-20' />
        </div>

        <div className='w-fit'>
            <CTAButton active={true} linkto={"/signup"} children={"Learn More"}/>
        </div>
      </div>
    </div>
  )
}

export default LearningLanguageSection
