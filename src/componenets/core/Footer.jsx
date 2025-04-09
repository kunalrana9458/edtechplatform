import React from 'react'
import studyNotionLogo  from '../../assets/Logo/Logo-Full-Light.png';

const Footer = () => {

    const resources = [
        "Articles",
        "Blog",
        "Chart Sheet",
        "Code challenges",
        "Docs",
        "Projects",
        "Videos",
        "Workspaces"
      ];
      

  return (
    <div className='bg-richblack-800 text-richblack-300 text-sm'>
      <div className='w-10/12 flex flex-col  gap-32 mx-auto'>
         {/* left section  */}
         <div className='flex flex-row mt-12 mb-16'>
             <div className='flex flex-col gap-[12px]'>
                <img
                src={studyNotionLogo}
                alt="" />

                <div className='font-bold text-richblack-200 text-lg'>Company</div>

                <div>
                    About
                </div>
                <div>Carreer</div>
                <div>Affiliates</div>

                <div>
                    S.M. Logo
                </div>
             </div>

             <div className='flex flex-col  gap-[12px] mt-12'>
             <div>Resources</div>
             <div>
                {/* vf  */}
               { resources.map((value,index) => {
                    return (
                        <div key={index}>
                           {value}
                        </div>
                    )
                })}
             </div>
             </div>

             <div>

             </div>

             <div>

             </div>
         </div>
         {/* right section  */}
      </div>
    </div>
  )
}

export default Footer
