import React from 'react'
import { FaUsers } from "react-icons/fa";
import { TbHierarchy3 } from "react-icons/tb";


const CourseCard = ({cardData,currentCard,setCurrentCard}) => {

  // const[currentStyleCard,setCurrentStyleCard] = useEffect(currentCard)
  console.log(currentCard)

  return (
      <div className={`flex flex-col gap-5 px-5 py-7 ${
                      cardData?.heading === currentCard ? "bg-white shadow-[12px_12px_0_0] shadow-yellow-50"
                      : "bg-richblack-800" } cursor-pointer`}
                      onClick={() => setCurrentCard(cardData?.heading)}>
         <h2
         className={`text-[1.2rem] font-bold
         ${cardData?.heading === currentCard ? "text-richblack-900" : "text-richblack-5" }`}>
        {cardData.heading} </h2>
         <p className='text-richblack-300 text-[1rem]'> {cardData.description} </p>
         <div className='flex flex-row justify-between items-center border-t-richblack-100  border-dashed border-t-2 border-richblack-200 mt-10
         '>
           {/* level  */}
           <div className={`
           flex flex-row items-center gap-2 text-richblack-100 mt-2
            ${cardData?.heading === currentCard ? "text-richblue-300" : "text-richblack-100" }`}>
              <FaUsers />
              <p>{cardData.level}</p>
           </div>
           <div className={`
           flex flex-row items-center gap-2 text-richblack-100 mt-2
            ${cardData?.heading === currentCard ? "text-richblue-200" : "text-richblack-100" }`}>
            {/* lessons  */}
            <TbHierarchy3 />
            <p> {cardData.lessionNumber + " Lessons"}  </p>
           </div>
         </div>
      </div>
  )
}

export default CourseCard;
