import React from 'react'
import HighlightText from '../HomePage/HighlightText'

const Quote = () => {
  return (
    <div>
      We are Passionate about revolutiaonary the way we learn. Our innovative platform
      <HighlightText text={"combines Technology"} /> 
      <span className='text-pink-400'>
        {" "}
        expertise
      </span>
      , and Community to create an
      <span className='text-pink-400'>
        unparalleled educational Purposes.
      </span>
    </div>
  )
}

export default Quote
