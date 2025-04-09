import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {AiOutlineEye,AiOutlineEyeInvisible} from 'react-icons/ai'
import { Link, useLocation } from 'react-router-dom'
import { resetPassword } from '../services/operations/authAPIs'
import IconButton from '../componenets/common/IconButton'
import { FaArrowRight } from "react-icons/fa";


const UpdatePassword = () => {
    const [showPassword,setShowPassword] = useState(false)
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);
    const {loading} = useSelector((state) => state.auth)
    const [formData,setFormData] = useState({
        password:"",
        confirmPassword:"",
    })
    const dispatch = useDispatch();

    const {password,confirmPassword} = formData
    const location = useLocation()

    const handleOnChange = (e) => {
        setFormData((prevData) => (
            {
                ...prevData,
                [e.target.name]:e.target.value
            }
        ))
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const token = location.pathname.split('/').at(-1);
        dispatch(resetPassword(password,confirmPassword,token)) // token is a token which is sent in a email link for update password
    }

  return (
    <div>
      {
        loading ? (
            <div>Loading...</div>
        ) : 
        (
            <div className='flex flex-col lg:w-[600px] mt-28 w-11/12 mx-auto'>
                <h1 
                className='text-[1.75rem] font-bold text-richblack-300'>
                Choose New Password </h1>
                <p className='font-semibold text-richblack-100'>Almost Done. Enter your new Password and your all set.</p>

                <form onSubmit={handleOnSubmit}>
                   <label htmlFor='password' className='relative'>
                      <p className='text-sm mt-2 text-richblack-50'>New Password <sup className='text-pink-500'>*</sup> </p>
                      <input
                      required
                      type={showPassword ? "text" : "password"}
                      name='password'
                      value={password}
                      onChange={handleOnChange}
                      placeholder='Password'
                      className='mt-2 bg-richblack-700 text-richblack-100 rounded-lg w-full p-2 border-richblack-500 border-b-2' />
                      <span
                      className='absolute right-2 -bottom-1'
                      onClick={() => setShowPassword((prev) => !prev)}>
                        {
                            showPassword ? 
                            (<AiOutlineEyeInvisible fontSize={24} />) : 
                            (<AiOutlineEye fontSize={24} />)
                        }
                      </span>
                   </label>
                   <label
                   htmlFor='confirmPassword'
                   className='relative' >
                      <p
                      className='text-sm mt-2 text-richblack-50'>Confirm New Password <sup className='text-pink-500'>*</sup> </p>
                      <input
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      name='confirmPassword'
                      value={confirmPassword}
                      onChange={handleOnChange}
                      placeholder='Confirm Password'
                      className='mt-2 bg-richblack-700 text-richblack-100 rounded-lg w-full p-2 border-richblack-500 border-b-2' />
                      <span
                      className='absolute right-2 -bottom-1'
                      onClick={() => setShowConfirmPassword((prev) => !prev)}>
                        {
                            showConfirmPassword ? 
                            (<AiOutlineEyeInvisible fontSize={24} />) : 
                            (<AiOutlineEye fontSize={24} />)
                        }
                      </span>
                   </label>
                   <IconButton type='submit' customClasses='mt-5'>
                      Reset Password
                   </IconButton>
                </form>
                <div 
                 className='mt-1 ml-1 text-richblack-50 flex items-center gap-1'>
                    <Link to="/login">
                        <p>Back To Login</p>
                    </Link>
                    <FaArrowRight />
                </div>
            </div>
        )
      }
    </div>
  )
}

export default UpdatePassword
