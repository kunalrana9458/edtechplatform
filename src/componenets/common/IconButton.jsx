import React from 'react'

const IconButton = ({
    text,
    onclick,
    children,
    disabled,
    outline=false,
    customClasses,
    type
}) => {
  return (
    <button
    disabled={disabled}
    onClick={onclick}
    // type={submit}
    className={`flex items-center gap-[4px] px-3 text-richblack-700  py-2 rounded
               ${!outline ? "bg-yellow-50" : "border-yellow-50 border text-yellow-50" } ${customClasses} `}
    >
        {
            children ? (
            <>
            <span>
                {text}
            </span>
            {children}
            </>) : text
        }
    </button>
  )
}

export default IconButton
