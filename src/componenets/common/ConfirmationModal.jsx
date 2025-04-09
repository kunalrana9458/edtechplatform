import React from "react";
import IconButton from "./IconButton";

const ConfirmationModal = ( {modalData} ) => {
  return (
    <div className="w-[350px] text-richblack-5 p-6 rounded-lg shadow-lg bg-richblack-800 flex flex-col gap-y-4">
      {/* Title */}
      <p className="text-xl font-bold">{modalData.text1}</p>

      {/* Description */}
      <p className="text-sm text-gray-600">{modalData.text2}</p>

      {/* Buttons */}
      <div className="flex justify-end gap-x-3">
        <IconButton
          onclick={modalData?.btn1Handler}
          text={modalData?.btn1Text}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        />
        <button
          onClick={modalData?.btn2Handler}
          className="px-4 py-2 rounded-md bg-pink-300 text-richblack-5 transition"
        >
          {modalData?.btn2Text}
        </button>
      </div>
    </div>
  );
};


export default ConfirmationModal