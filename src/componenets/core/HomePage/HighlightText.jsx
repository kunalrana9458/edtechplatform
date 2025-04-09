import React from 'react'

const HighlightText = ({text}) => {
  const gradientStyle = {
    fontWeight: 'bold',
    background: 'linear-gradient(-90deg, #1FA2FF,#12D8FA, #A6FFCB)', // Two-color gradient
    WebkitBackgroundClip: 'text', // Ensures compatibility with WebKit browsers
    WebkitTextFillColor: 'transparent', // Makes text transparent to show gradient
    textFillColor: 'transparent', // For other browsers
  };
  return (
    <span className='font-bold text-blue-100' style={gradientStyle}>
        {" "+text}
    </span>
  )
}

export default HighlightText
