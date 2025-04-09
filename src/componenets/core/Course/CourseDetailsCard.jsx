import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import copy from 'copy-to-clipboard'
import {toast} from 'react-hot-toast'
import {ACCOUNT_TYPE} from '../../../utils/constants'
import {addToCart} from '../../../slices/courseCartSlice'

function CourseDetailsCard({course,setConfirmationModal,handleBuyCourse}){

    const {
        thumbnail:ThumbnailImage,
        price:CurrentPrice,
        _id:courseId
    } = course


    const {user} = useSelector((state) => state.profile)
    const {token} = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleToCart = async() => {
        console.log("HANDLE TO CART CLICKED")
        if(user && user.accountType === ACCOUNT_TYPE.INSTRUCTOR){
            toast.error("Instructor Account Can't Buy Course")
            return 
        }
        if(token){
            dispatch(addToCart(course))
            return 
        }
        setConfirmationModal({
            text1:"You are not logged in",
            text2:"Please login to add to cart",
            btn1Text:"Login",
            btn2Text:"cancel",
            btn1Handler:()=>navigate("/login"),
            btn2Handler:()=>setConfirmationModal(null)
        })
    }


    const handleShare = async() => {
        copy(window.location.href)
        toast.success("Copy to Clipboard")
    }

    return (
        <div className='flex flex-col gap-y-4 w-[400px]'>
            <img 
            src={ThumbnailImage}
            className='max-h-[200px] min-h-[180px] w-[400px] rounded-xl object-cover'
            alt="" />
            <div className='text-richblack-25 font-bold text-2xl px-4'>
                Rs. {CurrentPrice}
            </div>
            <div className='px-4 flex flex-col gap-y-2'>
                <button
                className='bg-yellow-50 py-2 text-richblack-900 rounded-md
                border-richblack-50 border-b border-r'
                onClick={
                    user && course?.studentEnrolled.includes(user?._id) ?
                    () => navigate("/dashboard/enrolled-courses")
                    : handleBuyCourse
                } >
                    {
                        user && course?.studentEnrolled.includes(user?._id) ? "Go To Course" : "Buy Now"
                    }
                </button>

                {
                    (!course?.studentEnrolled.includes(user?._id)) && (
                        <button onClick={handleToCart}
                        className='py-2 bg-richblack-800 text-richblack-50 border-richblack-300 border-b border-r
                        rounded-md'>        
                            Add to Cart
                        </button>
                    )
                }
                
            </div>

            <div className='flex flex-col gap-x-2'>
                <p className='text-center text-richblack-100'>
                    30-Day Money-Back Guarante
                </p>
                <p className='ml-4 my-2 text-richblack-25'>
                   This Course Includes: 
                </p>
                <div className='flex flex-col gap-y-1 ml-4 text-caribbeangreen-400'>
                   {
                    JSON.parse(course?.instructions)?.map((item,index) => (
                         <p key={index}>
                            <span> {item} </span>
                         </p>
                    ))
                   }
                </div>
            </div>
            <div>
                <button
                className='mx-auto flex items-center  p-4 text-yellow-50'
                onClick={handleShare} >
                    Share
                </button>
            </div>
        </div>
    )
}

export default CourseDetailsCard