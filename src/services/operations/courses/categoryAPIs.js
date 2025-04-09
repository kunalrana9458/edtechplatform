import { categoryEndpoint } from "../../apis";
import { apiconnector } from "../../apiconnector";
import toast from "react-hot-toast";


const {GET_ALL_CATEGORIES} = categoryEndpoint

export async function fetchCourseCategories(){
    console.log("Fetch Course Category Called")
    try {
        const response = await apiconnector(
            "GET",
            GET_ALL_CATEGORIES
        )
        console.log("GET COURSE CATEGORY RESPONSE",response)
        if(!response.data.success){
            throw new Error("Error in Fetching Course Category")
        }
        console.log(response.data.data)
        return response.data.data
    } catch (error) {
        toast.error("Error in Fetch Course Category")
        console.log("Error in Fetching Course Category",error.message)
    }
}


