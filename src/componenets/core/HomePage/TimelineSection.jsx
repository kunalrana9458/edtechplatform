import React from 'react'
import Logo1 from '../../../assets/TimeLineLogo/Logo1.svg'
import Logo2 from '../../../assets/TimeLineLogo/Logo2.svg'
import Logo3 from '../../../assets/TimeLineLogo/Logo3.svg'
import Logo4 from '../../../assets/TimeLineLogo/Logo4.svg'
import timeLineImage from "../../../assets/Images/TimelineImage.png"

const timeLine = [
    {
        Logo: Logo1,
        heading: 'Leadership',
        description: "Fully Commited to the success company"
    },
    {
        Logo: Logo2,
        heading: 'Responsibility',
        description: "Students will always be our top priority"
    },
    {
        Logo: Logo3,
        heading: 'Flexibility',
        description: "The ability to switch is an important skills"
    },
    {
        Logo: Logo4,
        heading: 'Solve the Problem',
        description: "Code your way to a solution"
    }
]


const TimelineSection = () => {
    const boxStyle = {
        boxShadow: '18px 18px 0px rgba(255, 255, 255), 0px 0px 35px rgba(71, 165, 197,0.8)', // Adjust the offset, blur, and opacity as needed
        color: 'white',
      };
  return (
    <div className='w-full'>
      <div className='flex lg:flex-row flex-col gap-5 items-center justify-between'>
        {/* left box   */}
        <div className='w-[45% flex flex-col gap-10'>
          {
            timeLine.map((element,index) => {
            return (
                <div className='flex  flex-row gap-6' key={index}>
                  <div className='w-[50px] h-[50px] bg-white flex items-center'>
                     <img src={element.Logo} alt="" />
                  </div>
                  <div>
                    <h2 className='font-semibold text-[18px]'> {element.heading} </h2>
                    <p className='text-base'> {element.description} </p>
                  </div>
                </div>
            )
          })
          }
        </div>
        {/* right box  */}
        <div className='relative shadow-blue-200 pt-8'>
          <img
          alt=''
          src={timeLineImage}
          style={boxStyle}
          />
          <div className='absolute bg-caribbeangreen-700 flex lg:flex-row flex-col text-white uppercase py-10
          lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[-50%] '>
             <div className='flex flex-row gap-8 items-center border-r border-caribbeangreen-300 px-7'>
                <p className='text-3xl font-bold'>10</p>
                <p className='text-caribbeangreen-300 text-sm'>Years of Experience</p>
             </div>

             <div className='flex gap-8 items-center px-7'>
             <p className='text-3xl font-bold '>250</p>
             <p className='text-caribbeangreen-300 text-sm'>Types of courses</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimelineSection
