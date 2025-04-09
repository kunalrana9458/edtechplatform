import toast from "react-hot-toast"
import { apiconnector } from "../apiconnector"
import { catalogDataEndpoint } from "../apis"

const {CATALOGPAGEDATA_API} = catalogDataEndpoint 

export const getCatalogPageData = async(categoryId) => {
    const toastId = toast.loading("Loading...")
    let result = []
    try {
        const response = await apiconnector("POST",CATALOGPAGEDATA_API,
            {categoryId}
        )

        // if(!response?.data?.success){
            // throw new Error("Could not Fetch category page data")
        // }
        console.log("CATALOF PAGE API RESPONSE....",response)
        result = response?.data?.data

    } catch (error) {
        console.log("CATALOG PAGE DATA API ERROR....",error)
    }
    toast.dismiss(toastId)
    return result
}