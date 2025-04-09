import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getResetPassowordToken } from '../services/operations/authAPIs'
import IconButton from '../componenets/common/IconButton'
import { FaArrowRight } from "react-icons/fa";

const ForgotPassword = () => {

    const {loading} = useSelector((state) => state.auth)
    const [emailSent,setEmailSent] = useState(false)
    const [email,setEmail] = useState("")
    const dispatch = useDispatch();

    const handleOnSubmit = (e) => {
        e.preventDefault()
        dispatch(getResetPassowordToken(email,setEmailSent));
    }

  return (
    <div className='flex flex-col justify-center gap-y-[2rem] mt-28 w-11/12 mx-auto lg:w-[600px] items-center text-richblack-5'>
      {
        loading ? (
            <div>Loading</div>
        ) : 
        (
            <div className=''>
              <h1 className='text-[1.5rem] font-bold text-bold text-richblack-200'>
                {
                    !emailSent ? "Reset Your Password" : "Check Your Email"
                }
              </h1>
              <p className='text-richblack-50'>
                {
                    !emailSent ? `Have no fear. We'll email you instructions to reset your password. 
                    if you dont access to your email we can try account recovery` : `We have sent the reset email to your mail ${email}`
                }
              </p>

              <form
              className='mt-[1.75rem] flex flex-col gap-y-4'
              onSubmit={handleOnSubmit} >
                {
                    !emailSent && (
                        <label>
                          <p className='text-richblack-50 text-sm font-bold'>Email Address <sup className='text-pink-500'>*</sup> </p>
                          <input
                          type="email"
                          required
                          name='email'
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder='Enter Your Email Address'
                          className='mt-2 bg-richblack-700 rounded-lg w-full p-2 border-richblack-500 border-b-2' />
    
                        </label>
                    )
                }
                <IconButton 
                type='submit'
                customClasses="font-bold w-[180px]" >
                    {
                        !emailSent ? "Reset Password" : "Resend Email"
                    }
                </IconButton>

              </form>

              <div className='mt-1 ml-1 font-bold text-sm text-richblack-200'>
                <Link to="/login" className='flex items-center gap-1'>
                  <p>Back to Login</p>
                  <FaArrowRight />
                </Link>
              </div>

            </div>
        )
      }
    </div>
  )
}

export default ForgotPassword
