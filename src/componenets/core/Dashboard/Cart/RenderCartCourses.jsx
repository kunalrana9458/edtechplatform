import React from 'react'
import { useSelector } from 'react-redux'
import ReactStars from 'react-rating-stars-component'
import {GiNinjaStar} from 'react-icons/gi'
import {RiDeleteBin6Fill} from 'react-icons/ri'
import { removeFromCart } from '../../../../slices/courseCartSlice'
import { useDispatch } from 'react-redux'

const RenderCartCourses = () => {

    const {total,cart} = useSelector((state) => state.cart)
    const dispatch = useDispatch()

    console.log("Cart item is",cart)

  return (
    <div className='flex flex-col my-4 w-[70%]'>
      {
        cart.map((course,index) =>  (
            <div 
            className='flex  items-center justify-between  border-richblack-600 border-b px-2'
            key={index}>
               <div
               className='flex gap-x-3 items-center py-6'>
                <img
                height='180px'
                width='200px'
                src={course.thumbnail}
                className='rounded-md'
                alt="" />
                <div
                className='flex flex-col gap-y-3'>
                    <p
                    className='text-xl text-richblack-25
                    max-w-[200px]'> {course?.courseName} </p>
                    <p className='text-richblack-300'> {course?.category?.name} </p>
                    <div className='flex gap-x-2 items-center'>
                      <span className='text-yellow-50'> 4.4 </span>
                      <ReactStars
                      count={5}
                      size={20}
                      edit={false}
                      activeColor="#ffd700"
                      emptyIcon={<GiNinjaStar/>}
                      fullIcon={<GiNinjaStar/>}
                      />

                      <span> {course?.ratingAndReview?.length || "0"} </span>
                    
                    </div>
                </div>
               </div>

               <div className='flex flex-col gap-y-4'>
                <button className='flex items-center gap-x-2 bg-richblack-800 rounded-md text-[#DC143C] px-1 py-2'
                onClick={() => dispatch(removeFromCart(course._id))}>
                  <RiDeleteBin6Fill />
                  <span> Remove </span>
                </button>
                <div className='text-yellow-50 text-2xl'>Rs. {course.price} </div>
               </div>
            </div>
        )
      )}
    </div>
  )
}

export default RenderCartCourses
