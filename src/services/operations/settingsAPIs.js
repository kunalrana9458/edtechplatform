import { apiconnector } from "../apiconnector";
import {endpoints} from '../apis'
import {setUser} from '../../slices/profileSlice'
import {toast} from 'react-hot-toast'
import { useSelector } from "react-redux";

const {UPDATEDISPLAY_PICTURE,UPDATEPROFILE_DETAILS} = endpoints

export function updateDisplayPicture(formData,token){
    return async(dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
            if (!token) {
        console.log("Error: Token is missing.");
        return;
    }
            const response = await apiconnector(
            'PUT',
            UPDATEDISPLAY_PICTURE,
            formData,
            {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
        )
        toast.success("Image Uploaded Successfully")
        console.log("UPDATE PICTURE REPONSE",response)

        if(!response.data.success){
            throw new Error(response.data.message)
        }
        
        dispatch(setUser(response.data.data))
        } catch (error) {
            console.log("Error in Updation",error)
            toast.error("Image Upload Error")
        }
        toast.dismiss(toastId)
    }
}



export function updateProfileDetails(dateOfBirth,about,contactNumber,token){
    return async(dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
            const response = await apiconnector(
                "PUT",
                UPDATEPROFILE_DETAILS,
                {
                    dateOfBirth,
                    about,
                    contactNumber
                },
                {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                }
            )
            console.log("Updated Profile Details Response.....",response.data);
            if(!response.data.success){
                throw new Error("Error in Profile Updates")
            }
            toast.success("Profile Updated Successfully")
        } catch (error) {
            console.log("Error in Profile Updates",error)
            toast.error("Error in Profile Update")
        }
        toast.dismiss(toastId)
    }
}