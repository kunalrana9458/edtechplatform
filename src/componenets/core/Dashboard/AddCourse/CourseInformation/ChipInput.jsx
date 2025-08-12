import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

const ChipInput = ({ label, name, placeholder, setValue, errors,register,getValues }) => {
  const [chips, setChips] = useState([]);
  const editCourse = useSelector((state) => state.auth)

  const handleKeyDown = (event) => {
    if (event.key === "," || event.key === "Enter") {
      event.preventDefault();
      const chipValue = event.target.value.trim();
      if (chipValue && !chips.includes(chipValue)) {
        const newChips = [...chips, chipValue];
        setChips(newChips);
        event.target.value = "";
      }
    }
  };

  console.log("CHIPINPUT IS:",getValues("courseTags"))

  const handleDeleteChip = (chipIndex) => {
    // Filter the chips array to remove the chip with the given index
    const newChips = chips.filter((_, index) => index !== chipIndex);
    setChips(newChips);
  };

  useEffect(() => {
    register(name,{required:true,validate:(valid) => valid.length > 0})
    if(editCourse){
      setChips(getValues("courseTags"))
    }
  },[])

  useEffect(() => {
    setValue(name, chips);
  }, [chips]);

  return (
    <div>
      <label htmlFor={name}>
        {label} <sup>*</sup>{" "}
      </label>
      {/* chips array to be added */}
      <div className="flex gap-4">
        {
          chips && chips?.map((chip, index) => (
          <div key={index} className="flex gap-4">
            <div className="bg-yellow-100 rounded-lg my-2 opacity-80 text-richblack-900">
              {" "}
              {chip}
              <button 
              type="button"
              onClick={() => handleDeleteChip(index)}>
                <MdClose className="rounded-full opacity-70 text-richblack-800" />
              </button>{" "}
            </div>
          </div>
        ))}
      </div>
      <input
        className="bg-richblack-700 rounded-xl p-2"
        id={name}
        name={name}
        type="text"
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
      />
      {errors[name] && <span>{label} is required</span>}
    </div>
  );
};

export default ChipInput;
