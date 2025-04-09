import React from 'react'
import {Link} from 'react-router-dom'

const CTAButton = ({children,active,linkto}) => {
  const darkShadowStyle = {
    boxShadow:!active ? '2px 2px 0px rgba(66, 72, 84)' : '2px 2px 0px rgb(44,51,63)'
  } 

  return (
    <Link to={linkto}>
       <div className={`text-center text-[1rem] px-6 py-3 rounded-sm font-bold
                       ${active ? 'bg-yellow-50 text-black': 'bg-richblack-800 text-white'}
                       hover:scale-95 transition-all duration-200`
                       } 
                       style={darkShadowStyle}>
        {children}
       </div>
    </Link>
  )
}

export default CTAButton
