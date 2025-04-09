import { useSelector } from "react-redux"
import RenderCartAmount from "./RenderCartAmount"
import RenderCartCourses from "./RenderCartCourses"


export default function Cart(){


    const{total,totalItems} = useSelector((state) => state.cart)

    console.log("Total is:",typeof total)

    return(
        <div className="">
            <p className="text-richblack-300"> Home / Dashboard / <span className="text-yellow-50"> Wishlist </span>  </p>
            <h1 className="text-3xl text-richblack-5 my-3">My Wishlist</h1>
            <p className="text-richblack-300 font-semibold text-lg my-2"> {totalItems} Courses in Cart </p>

            {
                totalItems > 0 ? 
                (<div className="flex gap-x-12 border-richblack-700 border-t">
                    <RenderCartCourses />
                    <RenderCartAmount />
                </div>) : 
                (<p>Your Cart is Empty</p>)
            }

        </div>
    )
}