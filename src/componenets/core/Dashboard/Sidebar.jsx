import React, { useState } from 'react'
import { sidebarLinks } from '../../../data/dashboard-links'
import { logout } from '../../../services/operations/authAPIs'
import { useDispatch, useSelector } from 'react-redux'
import SideBarLink from './SideBarLink'
import { useNavigate } from 'react-router-dom'
import { VscSignOut } from 'react-icons/vsc'
import ConfirmationModal from '../../common/ConfirmationModal'


const Sidebar = () => {

    const {user,loading:profileLoading} = useSelector((state) => state.profile)
    const {loading:authLoading} = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [confirmationModal,setConfirmationModal] = useState(null)

    if(profileLoading || authLoading){
        return (
            <div className='w-full h-full flex items-center justify-center'>
                Loading...
            </div>
        )
    }

    // console.log(confirmationModal)
  return (
    <div className='bg-richblack-800 text-richblack-300'>
       <div className='flex min-w-[222px] flex-col border-r-[1px] border-richblack-800
       h-[500px] mt-8'>
         <div className='flex flex-col gap-3'>
           {
            sidebarLinks.map((link) => {
                if(link.type && user?.accountType !== link.type) return null
                return (
                   <SideBarLink 
                   link={link}
                   iconName={link.icon}
                   key={link.id} />
                )
            })
           }
         </div>

         <div className='mx-auto mt-6 mb-6 h-[1px] w-10/12 text-sm border border-richblack-500 bg-richblack-600'>
           <div className='flex flex-col gap-2 mt-3'>

             <SideBarLink
             link={{name:"Settings",
                   path:"dashboard/settings"}}
             iconName="VscSettingsGear"
              />

              <button
              onClick={()=>setConfirmationModal(
                {
                  text1: "Are You Sure ?",
                  text2: "You will be logged out of your account",
                  btn1Text:"Logout",
                  btn2Text:"Cancel",
                  btn1Handler:() => dispatch(logout(navigate)),
                  btn2Handler:() => {setConfirmationModal(null)}
              }
              )}
              className='text-sm font-medium text-richblack-300'>
                <div className='flex items-center gap-x-2 '>
                  <VscSignOut className='text-lg' />
                  <span>Logout</span>
                </div>
              </button>
           </div>
         </div>
       </div>
       {
  confirmationModal && (
    <>
      {/* Blur Background */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"></div>
      
      {/* Centered Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <ConfirmationModal modalData={confirmationModal} />
      </div>
    </>
  )
}

    </div>
  )
}

export default Sidebar
