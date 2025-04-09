import React from 'react'
import { buyCourse } from '../../../../services/operations/studentFeatureAPI'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


const RenderCartAmount = () => {

  const {cart,total} = useSelector((state) => state.cart)
  const {token} = useSelector((state) => state.auth)
  const {user} = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  console.log(user)

  return (
    <div className='bg-richblack-800 border-richblack-500 border
    flex flex-col gap-y-2 h-[150px] mt-4 rounded-md p-4 w-[250px]'>
      <p className='text-richblack-300'>Total:</p>
      <p className='text-2xl text-yellow-50 font-semibold'> Rs. {total} </p>
      <button 
      className='px-6 bg-yellow-50 text-richblack-900 
      rounded-md
      py-2'
      onClick={() => buyCourse(token,cart,user,navigate,dispatch)} >Buy Now</button>
    </div>
  )
}

export default RenderCartAmount
