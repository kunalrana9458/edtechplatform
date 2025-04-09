import React from 'react'
import {Swiper,SwiperSlide} from 'swiper/react'
import Course_Card from './Course_Card'
import 'swiper/css'

const CourseSlider = ({Courses,height}) => {
  return (
    <>
      {
        Courses?.length ? (
          <Swiper
          spaceBetween={30}
          slidesPerView={3}
           >
             {
              Courses?.map((course,index) => (
                <SwiperSlide key={index} >
                  <Course_Card course={course} height={height} />
                </SwiperSlide>
              ))
             }
          </Swiper>
        ) : (
          <div>

          </div>
        )
      }
    </>
  )
}

export default CourseSlider
