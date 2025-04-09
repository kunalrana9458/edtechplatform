import toast from 'react-hot-toast'
import {studentPaymentEndpoints} from '../apis'
import { apiconnector } from '../apiconnector'
import rzpLogo from '../../assets/Logo/Logo-Full-Dark.png'
import { setPaymentLoading } from '../../slices/courseSlice'
import {resetCart} from '../../slices/courseCartSlice'

const {COURSE_PAYMENT_API,COURSE_VERIFY_API,SEND_PAYMENT_SUCCESS_EMAIL_API} = studentPaymentEndpoints

function loadScript(src){
    return new Promise((resolve) => {
        const script = document.createElement("script")
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}

export async function buyCourse(token,courses,userDetails,navigate,dispatch) {
    const toastId = toast.loading("Loading...")
    console.log("Course is:",courses)
    try {
        // load the script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")
        
        if(!res){
            toast.error("Razorpay SDK Failed to load")
            return ;
        }

        // intiate the order 
        const orderResponse = await apiconnector("POST",COURSE_PAYMENT_API,{courses},
            {
                Authorisation: `Bearer ${token}`
            }
        )
        
        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message)
        }
    
        const rzKey = process.env.REACT_APP_RAZORPAY_KEY_FRONTEND;
        console.log("Rz Key is:",rzKey)

        const options = {
            key:rzKey,
            currency: orderResponse.data.data.currency,
            amount: `${orderResponse.data.data.amount}`,
            order_id: orderResponse.data.data.id,
            name:"StudyNotion",
            description:"Thank You for Purchasing the Course",
            image:rzpLogo,
            prefill:{
                name:`${userDetails.firstName}`,
                email:`${userDetails.email}`
            },
            handler: function(response) {
                // send successfull mail
                sendPaymentSucessEmail(response,orderResponse.data.data.amount,token)
                // verify payment
                verifyPayment({...response,courses},token,navigate,dispatch)
            }
        }

        const paymentObject = new window.Razorpay(options)
        paymentObject.open()
        paymentObject.on("Payment Failed.",function(response){
            toast.error("Your Payment had been Failed")
            console.log(response)
        })

    } catch (error) {
        console.log("PAYMENT API RESPONSE...",error)
        toast.error("Could not make Payment")   
    }
    toast.dismiss(toastId)
}

async function sendPaymentSucessEmail(response,amount,token){
    try {
        await apiconnector("POST",SEND_PAYMENT_SUCCESS_EMAIL_API,{
            orderId:response.razorpay_order_id,
            paymentId:response.razorpay_payment_id,
            amount
        },{
            Authorisation: `Bearer ${token}`
        })
    } catch (error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR.....",error)
    }
}

// verify payment
async function verifyPayment(bodyData,token,navigate,dispatch){
    const toastId = toast.loading("Loading...")
    dispatch(setPaymentLoading(true))
    try {
        const response = await apiconnector("POST",COURSE_VERIFY_API,bodyData,{
            Authorisation: `Bearer ${token}`,
        })

        if(!response){
            throw new Error(response.data.message)
        }

        toast.success("Payment Successfull, You are added to the course")
        navigate("/dashboard/enrolled-course")
        dispatch(resetCart())
    } catch (error) {
        console.log("PAYMENT VERIFY ERROR",error)
        toast.error("Could not Verify Payment")   
    }
    toast.dismiss(toastId)
    dispatch(setPaymentLoading(false))
}