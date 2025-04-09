import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RatingStars from '../../common/RatingStars'
import GetAvgRating from '../../../utils/avgRating'

const Course_Card = ({course,height}) => {

  const [avgReviewCount,setAvgReviewCount] = useState(0)

  useEffect(() => {
    const count = GetAvgRating(course?.ratingAndReviews)
    setAvgReviewCount(count)
  },[course])
  
  return (
    <div className="flex flex-col gap-x-5">
      <Link to={`/courses/${course._id}`}>
        <div className="flex flex-col gap-y-3">
          <div>
            <img 
            src={course.thumbnail}
            alt="course thumbnail"
            className={`w-full rounded-xl ${height} object-cover`} />
          </div>
          <div
          className="text-white flex flex-col gap-y-2">
            <p className="text-richblack-5"> {course?.courseName} </p>
            <p> {course?.instructor?.firstName} {course?.instructor?.lastName} </p>
            <div className="flex gap-x-2 text-sm">
              <span className="text-yellow-50"> {avgReviewCount || 0} </span>
              <RatingStars Review_count={avgReviewCount} />
              <span className="text-richblack-600"> {course?.ratingAndReviews?.length } {"(Review Count)"} </span>
            </div>
            <p className="text-richblack-5 text-[1rem] font-[500] font-mullish"> Rs. {course?.price} </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Course_Card;
