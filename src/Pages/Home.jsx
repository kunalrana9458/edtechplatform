import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import HighlightText from "../componenets/core/HomePage/HighlightText";
import CTAButton from "../componenets/core/HomePage/CTAButton";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../componenets/core/HomePage/CodeBlocks";
import TimelineSection from "../componenets/core/HomePage/TimelineSection";
import LearningLanguageSection from "../componenets/core/HomePage/LearningLanguageSection";
import InstructorSection from "../componenets/core/HomePage/InstructorSection";
import ExploreMore from "../componenets/core/HomePage/ExploreMore";
import Footer from "../componenets/core/Footer";


const Home = () => {
  const boxStyle = {
    boxShadow:
      "18px 18px 0px rgba(255, 255, 255), 0px 0px 35px rgba(71, 165, 197,0.8)", // Adjust the offset, blur, and opacity as needed
    color: "white",
  };
  return (
    <div>
      {/* section 1 */}
      <div className="max-w-[1260px] relative mx-auto flex flex-col w-11/12 items-center text-white justify-between">
        <Link to={"/signup"}>
          <div
            className="group mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
            transition-all duration-200 hover:scale-95 lg:mt-16 mt-6 -ml-[100px] p-1"
          >
            <div
              className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
            duration-200 transition-200 group-hover:bg-richblack-900 shadow-sm"
            >
              <p>Become An Instructor</p>
              <FaArrowRight className="hidden lg:block" />
            </div>
          </div>
        </Link>

        <div className="text-4xl text-center font-semibold text-white mt-6">
          Empower Your Future with
          <HighlightText text={"Coding Skills"} />
        </div>

        <div className=" mt-4 w-[90%] text-center font-bold text-richblack-300">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth, including hands-on
          projects puzzles, and personalized feedback from instructors
        </div>

        <div className="flex flex-row gap-7 mt-8">
          <CTAButton active={true} linkto={"/signup"}>
            {" "}
            Learn More{" "}
          </CTAButton>
          <CTAButton active={false} linkto={"/login"}>
            {" "}
            Book a Demo{" "}
          </CTAButton>
        </div>

        <div className="mx-3 my-12">
          <video muted loop autoPlay style={boxStyle}>
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

        {/* code seciton -1  */}
        <div>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="font-semibold text-4xl">
                Unlock Your
                <HighlightText text={"coding potential "} />
                with our online courses.
              </div>
            }
            subHeading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate sharing their knowledge with you"
            }
            ctabtn1={{
              btnText: "Try it Yourself",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              linkto: "/login",
              active: false,
            }}
            codeblock={`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                <title>Basic HTML Page</title>
                <link rel="stylesheet" href="styles.css">
                </head>
                <body>
                <nav> <a href="/one">Goto..</a>      
                </nav>    
                </body> 
                </html>
                `}
            codeColor={"text-yellow-200"}
          />
        </div>

        {/* code seciton -2  */}
        <div className="mt-12">
          <CodeBlocks
            position={"flex-row-reverse"}
            heading={
              <div className="font-semibold text-4xl w-[40%]">
                Start
                <HighlightText text={"coding in Seconds "} />
              </div>
            }
            subHeading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              btnText: "Continue Lesson",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              linkto: "/login",
              active: false,
            }}
            codeblock={`
                import react from 'react';
                import {Link} 'react-router-dom';
                import signUp from '../pages/signup';
                const App = () => {
                  return(
                    <Routes>
                      <Route to={"/signup"} element={<signUp/>} />
                    </Routes>
                  )
                }
                `}
            codeColor={"text-blue-50"}
          />

        </div>
          <ExploreMore />
      </div>
      {/* section 2 */}

      <div className="bg-pure-greys-5 text-richblack-700">
        <div className="homepage_bg h-[310px]">
          <div className="w-11/12 max-w-maxContent flex flex-col items-center gap-5 mx-auto">
            <div className="h-[150px]"></div>
            <div className="flex flex-row gap-7 text-white">
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex gap-2 items-center">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>
              <CTAButton active={false} linkto={"/signup"}>
                <div>Learn More </div>
              </CTAButton>
            </div>
          </div>
        </div>

        <div className="mx-auto w-11/12 max-w-maxContent flex flex-col items-center gap-7">
          <div className="flex flex-col  lg:flex-row gap-5 mb-10 mt-[95px] justify-between">
            <div className="text-4xl font-semibold lg:w-[45%] w-full">
              Get the skills you need for a
              <HighlightText text={"Job that is in demand"} />
            </div>
            <div className="flex flex-col gap-10 w-full lg:w-[40%] items-start">
              <div>
                The Modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              <div>
                <CTAButton active={true} linkto={"/signup"}>
                  Learn more
                </CTAButton>
              </div>
            </div>
          </div>

          <TimelineSection />
          <LearningLanguageSection />
        </div>
      </div>

      {/* section 3 */}
      <div className="w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        <InstructorSection />
        <h2 className="text-center text-4xl font-semibold mt-10">
          Review From Other Learners
        </h2>
        {/* Review Slider Code */}
      </div>

      {/* footer  */}
      <Footer />
    </div>
  );
};

export default Home;
