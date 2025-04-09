import { endpoints } from "../apis";
import { CheckmarkIcon, toast } from "react-hot-toast";
import { setToken, setLoading,setSignupData } from "../../slices/authSlice";
import { apiconnector } from "../apiconnector";
import { setUser } from "../../slices/profileSlice";


const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints;

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiconnector("POST", LOGIN_API, {
        email,
        password,
      });
      // console.log("LOGIN API RESPONSE........", response);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Login Successfull");
      dispatch(setToken(response.data.token));
      const userImage = response.data?.userExist?.image
        ? response.data.userExist.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.userExist.firstName} ${response.data.userExist.lastName}`;
      dispatch(setUser({ ...response.data.userExist, userImage }));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user",JSON.stringify(response.data.userExist))
      navigate("/dashboard/my-profile");
    } catch (error) {
      console.log("LOGIN API ERROR............", error);
      toast.error("Login Failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}


export function sendOtp(email,navigate){
  return async(dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiconnector("POST",SENDOTP_API,{
        email,
        CheckUserPresent:true,
      })
      console.log("OTP RESPONSE.........",response)
      console.log(response.data.success)

      if(!response.data.success){
        throw new Error(response.data.message)
      }

      toast.success("OTP Send Successfully")
      navigate("/verify-email")
    } catch (error) {
      console.log("SENDOTP Error.....",error)
      toast.error("Could Not Send OTP")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}


export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async(dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true));
    try {
      const response = await apiconnector("POST",SIGNUP_API,{
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      })
      console.log("SIGN UP RESPONSE.........",response);

      if(!response.data.success){
        throw new Error(response.data.message)
      }
      toast.success("SignUp Successfull")
      navigate('/login')
    } catch (error) {
      console.log("SIGN UP FAILURE...........",error)
      toast.error("Signup Failed")
      navigate("/signup")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function logout(navigate){
  return async(dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logout Successfull")
    navigate("/")
  }
}

export function getResetPassowordToken(email,setEmailSent){
  return async(dispatch) => {
    dispatch(setLoading(true))
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiconnector("POST",RESETPASSTOKEN_API,{
        email
      })

      if(!response.data.success){
        throw new Error(response.data.message)
      }
      
      toast.success("Reset Email Sent")
      setEmailSent(true);
    } catch (error) {
      console.log("RESET PASSWORD TOKEN ERROR",error.message)
      toast.error("Error in Reset Email")
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId)
  }
}

export function resetPassword(password,confirmPassword,token){
  return async(dispatch) => {
    dispatch(setLoading(true))
    const toastId = toast.loading("Loading...")
    try {
      
      const response = await apiconnector("POST",RESETPASSWORD_API,{
        password,
        confirmPassword,
        token
      })
      console.log("RESET PASSWORD RESPONSE...",response)

      if(!response.data.success){
        throw new Error(response.data.message)
      }

      toast.success("Password Reset Successfully")
    } catch (error) {
      console.log('RESET PASSWORD ERROR',error)
      toast.error("Unable To Reset Password")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}