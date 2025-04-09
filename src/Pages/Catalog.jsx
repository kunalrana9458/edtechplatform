import React, { useEffect, useState } from 'react'
import Footer from '../componenets/core/Footer'
import {getCatalogPageData} from '../services/operations/PageAndComponentData'
import { useParams } from 'react-router-dom'
import { fetchCourseCategories } from '../services/operations/courses/categoryAPIs'
import { apiconnector } from '../services/apiconnector'
import {categoryEndpoint} from '../services/apis'
import CourseSlider from '../componenets/core/Catalog/CourseSlider'
import Course_Card from '../componenets/core/Catalog/Course_Card'

const Catalog = () => {

    const {catalogName} = useParams()
    const [catalogPageData,setCatalogPageData] = useState()
    const [categoryId,setCategoryId] = useState("")

    // fetch all categories
    useEffect(() => {
        const getCategoryDetails = async() => {
            const res = await apiconnector("GET",categoryEndpoint.GET_ALL_CATEGORIES)
            const category_id = res?.data?.data?.filter((ct) => ct.name.split(' ').join('-').toLowerCase() === catalogName)[0]._id
            setCategoryId(category_id)
        }

        getCategoryDetails()
    },[catalogName])

    useEffect(() => {
        const getCategoryDetails = async() => {
            try {
                const res = await getCatalogPageData(categoryId)
                setCatalogPageData(res)
            } catch (error) {
                console.log("Error in fetching catalog:",error)
            }
        }
        if(categoryId){
            getCategoryDetails()
        }
    },[categoryId]);

    console.log("Catalog page:",catalogPageData)

  return (
    <div className='flex flex-col gap-y-12'>

    <div className='bg-richblack-800'>
    <div className='w-10/12 mx-auto flex justify-between my-12'>
     <div className='flex flex-col gap-4 w-[60%]'>
        <p className='text-richblack-300 text-[1rem]'> Home  /  Catalog  /  {" "}
        <span className='text-yellow-100'>
        {catalogPageData?.selectedCategory?.name}
        </span>  </p>
        <p className='text-[1.75rem] text-richblack-5 font-semibold'>
        {catalogPageData?.selectedCategory?.name}
        </p>
        <p className='text-richblack-100'> 
        {catalogPageData?.selectedCategory?.description} </p>
     </div>

     {/* related resources  */}
     <div className='mr-10'>
     <h1 className='text-lg font-semibold text-richblack-25'>Related Resources</h1>
        <ul className='list-disc ml-4 text-richblack-200 flex flex-col gap-y-3'>
          <li>Doc Python</li>
          <li>Cheatsheets</li>
          <li>Articles</li>
          <li>Community Fortunes</li>
          <li>Projects</li>
        </ul>
     </div>

     </div>
    </div>

     <div className='w-10/12 mx-auto flex flex-col gap-y-8'>
        {/* section 1   */}
        <div className='flex flex-col gap-y-8'>  
        <div className='text-richblack-5 text-[1.5rem] font-[500]'> Course to get you Started </div>
            <div className='flex gap-x-6 text-richblack-200 border-richblack-400 border-b'>
                <p className='border-b-2 border-yellow-50 text-yellow-50'>Most Popular</p>
                <p>New</p>
                <p>Trending</p>
            </div>
            <div>
            <CourseSlider Courses={catalogPageData?.selectedCategory?.courses} height={'h-[200px]'} />
            </div>
        </div>

        {/* section 2 */}

        <div className='flex flex-col gap-y-8 mt-4'>
            <p className='text-richblack-5 text-[1.5rem] font-[500]'>Top Courses in{catalogPageData?.differentCategory?.name} </p>
            <div>
                <CourseSlider Courses={catalogPageData?.differentCategory?.courses} height={'h-[200px]'} />
            </div>
        </div>

        {/* section 3   */}
        <div>
            <p className='text-richblack-25 text-[1.5rem]'> Frequently Bought Together </p>

            <div className='py-8'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {
                    catalogPageData?.mostSellingCourses && (catalogPageData?.mostSellingCourses?.splice(0,4)
                    .map((course,index) => (
                        <Course_Card key={index} height={'h-[400px]'} course={course} />
                    ))) 
                }
              </div>
            </div>

        </div>

     </div>

     <Footer />

    </div>
  )
}

export default Catalog
