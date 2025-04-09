import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const RequirementField = ({label,placeholder,name,register,errors,setValue,getValues}) => {

    const [requirement,setRequirement] = useState('');
    const [requirementList,setRequirementList] = useState([])
    const {editCourse} = useSelector((state) => state.course)

    const handleAddRequirement = () => {
        if(requirement){
            setRequirementList([...requirementList,requirement])
            setRequirement('')
        }
        console.log(requirementList)
    }

    const handleRemoveRequirement = (index) => {
        const updatedRequirementList = [...requirementList]
        updatedRequirementList.splice(index,1)
        setRequirementList(updatedRequirementList)
    }

    useEffect(() => { 
        register(name,{
            required:true,
            validate: (value) => value.length > 0
        })
        if(editCourse){
            setRequirementList(getValues(name))
        }
    },[])
     
    useEffect(() => {
        setValue(name,requirementList)
    },[requirementList])

  return (
    <div>
        <div className='flex flex-col gap-y-2'>
      <label htmlFor={name}
      className='text-sm'> {label}  <sup className='text-pink-500'>*</sup> </label>
      <input
      className='bg-richblack-700 p-2 rounded-lg' 
      name={name}
      id={name}
      value={requirement}
      placeholder={placeholder}
      type="text"
      onChange={(event) => setRequirement(event.target.value)}
       />
       <button className='ml-2 text-sm font-bold text-yellow-200'
       onClick={handleAddRequirement} type='button'> ADD </button>
    </div>

    {
        requirementList.length > 0 && (
            <ul className='flex flex-col gap-x-2'>
                {
                    requirementList.map((requirement,index) => (
                        <li key={index}>
                          <span>  {requirement} </span>
                          <button
                          type='button'
                          onClick={() => handleRemoveRequirement(index)}
                          className='text-xs text-pure-grey-300 text-pink-500'
                          >
                            Remove
                          </button>
                        </li>
                    ))
                }
            </ul>
        )
    }
    {
        errors[name] && (
            <span>
                {label} is required
            </span>
        )
    }
    </div>
   
  )
}

export default RequirementField;
