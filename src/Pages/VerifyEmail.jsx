import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import OTPInput from 'react-otp-input'
import { Link, useNavigate } from 'react-router-dom'
import { sendOtp, signUp } from '../services/operations/authAPIs'
import IconButton from '../componenets/common/IconButton'
import { FaArrowLeft } from 'react-icons/fa'


const VerifyEmail = () => {
    const {loading,signupData} = useSelector((state) => state.auth)
    const [otp,setOtp] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if(!signupData){
            navigate("/signup")
            return 
        }
    },[])

    const {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword, 
    } = signupData

    const handleOnSubmit = (e) => {
        e.preventDefault()
        dispatch(signUp(
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            otp,
            navigate
        ))
    }

  return (
    <div>
      {
        loading ? (<div>Loading...</div>)
        :
        (
            <div className='flex flex-col lg:w-[600px] mt-28 w-11/12 mx-auto'>
                <h1
                className='text-[1.75rem] font-bold text-richblack-300'
                >Verfiy Email</h1>
                <p
                className='font-semibold text-richblack-100' >A verification code has been sent to you. Enter the code below</p>
                <form onSubmit={handleOnSubmit }>
                  <OTPInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  containerStyle='mt-4 text-white'
                  inputStyle={{
    width: "50px",
    height: "50px",
    marginRight: "8px",
    backgroundColor: "#2C333F",
    borderBottom: "2px solid #999DAA",
    borderRadius:"8px",
    color: "white",
  }}

                  renderInput={(props) => <input {...props} />}
                  />
                   <IconButton type='submit'
                   customClasses='mt-4 font-semibold text-sm'
                   >
                      Verify Email
                   </IconButton>
                </form>

                <div className='mt-1 ml-1 text-richblack-50 flex items-center gap-1'>
                <FaArrowLeft />
                    <Link to="/login">
                        <p>Back To Login</p>
                    </Link>
                </div>

                <IconButton
                customClasses='w-[200px] mt-4 font-semibold text-richblack-700 text-lg'
                onclick={() => dispatch(sendOtp(email,navigate))} >
                    Resend
                </IconButton>

            </div>
        )
      }
    </div>
  )
}

export default VerifyEmail
