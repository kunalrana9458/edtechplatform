import React from 'react'
import InstructorImg from '../../../assets/Images/Instructor.png'
import HighlightText from './HighlightText'
import CTAButton from './CTAButton'
import { FaArrowRight } from 'react-icons/fa'

const InstructorSection = () => {
  return (
    <div>
      <div className='flex lg:flex-row flex-col gap-20 items-center'>
        <div>
            <img
            src={InstructorImg}
            alt=""
            className='mt-16' />
        </div>

        <div className='lg:w-[50%] w-full flex flex-col gap-10'>
           <div className='text-4xl font-semibold w-full lg:w-[50%]'>
            Become An
            <HighlightText text={"Instructor"} />
           </div>
           <p className='font-medium text-[16px] w-[95%] text-richblack-300'>
           Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
           </p>

           <div className='w-fit'>
           <CTAButton active={true} linkto={'/signup'}>
            <div className='flex flex-row gap-2 items-center'>
              Start Learning Today
              <FaArrowRight />
            </div>
           </CTAButton> 
           </div>
        </div>

      </div>
    </div>
  )
}

export default InstructorSection
