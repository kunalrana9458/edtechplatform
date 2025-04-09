import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import ReactStars from 'react-rating-stars-component'
import IconButton from '../../common/IconButton'
import { createRating } from '../../../services/operations/courses/coursesAPIs'


const CourseReviewModal = ({setReviewModal}) => {

  const {user} = useSelector((state) => state.profile)
  const {token} = useSelector((state) => state.auth)
  const {courseEntireData} = useSelector((state) => state.viewCourse)

  const {
    register,
    handleSubmit,
    setValue,
    formState:{errors}
  } = useForm()

  useEffect(() => {
    setValue("courseExperience","")
    setValue("courseRating","")
  },[])

  const onSubmit = async(data) => {
    await createRating(
      {
        courseId:courseEntireData.data,
        rating:data.courseRating,
        review:data.courseExperience
      },
      token
    )
    setReviewModal(false)
  }

  const ratingChange = (newRating) => {
    setValue("courseRating",newRating)
  }

  return (
    <div>
      <div>
        {/* Modal Header  */}
        <div>
          <p>Add Review</p>
          <button
          onClick={() => setReviewModal(false)} >
            Close
          </button>
        </div>
        {/* modal body  */}
        <div>
          <div>
            <img
            src={user?.image}
            alt=""
            className='aspect-square w-[50px] rounded-full object-cover' />
            <div>
              <p> {user?.firstName} + " " + {user?.lastName} </p>
              <p> Posting Publicly </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}
          className='mt-6 flex flex-col items-center'> 
             <ReactStars
             count={5}
             size={24}
             onChange={ratingChange}
             activeColor='#ffd700'
             />

             <div>
              <label htmlFor="courseExperience">Add Your Experience</label>
              <textarea
              name=""
              id="courseExperience"
              placeholder='Add Your Experience here'
              {...register("courseExperience",{required:true})}
              className='form-style min-h-[130px] w-full' />
              {
                errors.courseExperience && (
                  <span> Please add your experience </span>
                )
              }
             </div>

             {/* cancel and save button  */}
             <div>
              <button
              type='button'
              onClick={() => setReviewModal(false)} >
                Cancel
              </button>
              <button>
                <IconButton
                text='save' />
              </button>
             </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default CourseReviewModal
