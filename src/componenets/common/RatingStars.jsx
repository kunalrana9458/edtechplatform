import React, { useEffect, useState } from 'react'
import {TiStarFullOutline,TiStarHalfOutline,TiStarOutline} from 'react-icons/ti'


const RatingStars = ({Review_count,star_size}) => {

    const [starCount,setStarCount] = useState({
        full:0,
        half:0,
        empty:0
    })

    useEffect(() => {
        const wholeStars = Math.floor(Review_count) || 0
        const halfStars = Number.isInteger(Review_count) ? 0 : 1
        const emptyStars = Number.isInteger(Review_count) ? 5-wholeStars : 4-wholeStars
        setStarCount({
            full:wholeStars,
            half:halfStars,
            empty:emptyStars
        })
    },[Review_count])

  return (
    <div className='flex'>
       {
        [...new Array(starCount.full)].map((_,i) => (
            <TiStarFullOutline key={i} size={star_size || 20} className='text-yellow-50' />
        )) 
       }
       {
        [...new Array(starCount.half)].map((_,i) => (
            <TiStarHalfOutline key={i} size={star_size || 20} className='text-yellow-50' /> 
        ))
       }
       {
        [...new Array(starCount.empty)].map((_,i) => (
            <TiStarFullOutline key={i } size={star_size || 20} className='text-richblack-700' /> 
        ))
       }
    </div>
  )
}

export default RatingStars
