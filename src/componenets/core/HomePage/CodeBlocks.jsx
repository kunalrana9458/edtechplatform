import React from "react";
import CTAButton from "./CTAButton";
import { FaArrowRight } from "react-icons/fa";
import {TypeAnimation} from 'react-type-animation'

const CodeBlocks = ({ position, heading, subHeading, ctabtn1, ctabtn2,codeblock,codeColor }) => {
  //   props needed : postion heading subHeading ctabtn1 ctabtn2 codeblocks  backgroundGradient bgColor
  return (
    <div className={`flex ${position==='flex-row-reverse' ? 'lg:flex-row-reverse' : 'lg:flex-row'} flex-col justify-between gap-20 my-10`}>
      {/* section 1 */}
      <div className="lg:w-[50%] w-full flex flex-col gap-8">
        {heading}
        <div className="text-richblack-300 text-[1rem] font-bold">{subHeading}</div>
        <div className="flex gap-7 mt-7">
          <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
            <div className="flex gap-2 items-center">
              {ctabtn1.btnText}
              <FaArrowRight />
            </div>
          </CTAButton>

          <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
            <div className="flex gap-2 items-center">
              {ctabtn2.btnText}
              <FaArrowRight />
            </div>
          </CTAButton>
        </div>
      </div>

      {/* section 2 */}
      <div className="flex flex-row text-[1rem] w-[100%] h-fit lg:w-[500px] opacity-10 border border-rich"
      style={{
        background: 'linear-gradient(111.93deg, rgba(14, 26, 45, 0.24) -1.4%, rgba(17, 30, 50, 0.38) 104.96%)',
      }}>
        {/* HW: add gradient behind the code block  */}
        <div className="text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold py-[27px]">
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
          <p>7</p>
          <p>8</p>
          <p>9</p>
          <p>10</p>
          <p>11</p>
        </div>

        <div className={`w-[90%] flex flex-col gap-2 font-bold  font-mono ${codeColor} pr-2`}>
           <TypeAnimation
            sequence={[codeblock,2000,""]}
            repeat={Infinity}
            cursor={true}
            omitDeletionAnimation={true}
            style={
                {
                    whiteSpace:'pre-line',
                    display:'block'
                }
            }
           />
        </div>
      </div>
    </div>
  );
};

export default CodeBlocks;
