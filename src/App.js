import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from './Pages/Signup'
import Navbar from "./componenets/common/Navbar";
import ForgotPassword from "./Pages/ForgotPassword";
import UpdatePassword from "./Pages/UpdatePassword";
import VerifyEmail from "./Pages/VerifyEmail";
import About from "./Pages/About";
import OpenRoute from "./componenets/core/Auth/OpenRoute";
import MyProfile from "./componenets/core/Dashboard/MyProfile";
import Dashboard from "./Pages/Dashboard";
import PrivateRoute from "./componenets/core/Auth/PrivateRoute";
import EditProfile from "./componenets/core/Dashboard/EditProfile";
import EnrolledCourses from "./componenets/core/Dashboard/EnrolledCourses";
import ErrorPage from "./Pages/ErrorPage";
import AddCourse from "./componenets/core/Dashboard/AddCourse";
import MyCourses from "./componenets/core/Dashboard/MyCourses";
import EditCourse from "./componenets/core/Dashboard/EditCourse";
import Catalog from "./Pages/Catalog";
import CourseDetails from "./Pages/CourseDetails";
import ViewCourse from "./Pages/ViewCourse";
import { ACCOUNT_TYPE } from "./utils/constants";
import { useSelector } from "react-redux";
import VideoDetails from './componenets/core/ViewCourse/VideoDetails'
import CartComponent from './componenets/core/Dashboard/Cart'
import Instructor from "./componenets/core/Dashboard/InstructorDashboard/Instructor";

function App() {

  const {user} = useSelector((state) => state.profile)

  return(
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />
      <Routes>
         {/* 404 not found Paage */}
        <Route path="*" element={<ErrorPage />} />
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About />} /> 
        <Route path="/catalog/:catalogName" element={<Catalog />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/login" element={
          <OpenRoute>
            <Login />
          </OpenRoute>
        } />
        <Route path="/signup" element={
          <OpenRoute>
            <Signup />
          </OpenRoute>
        } /> 
        <Route path="/forgot-password" element={
          <OpenRoute>
            <ForgotPassword />
          </OpenRoute>
          } />
        <Route path="/update-password/:id" element={
          <OpenRoute>
            <UpdatePassword />
          </OpenRoute>
          } />
        <Route path="/verify-email" element={
          <OpenRoute>
            <VerifyEmail />
          </OpenRoute>
        } /> 

        {/* Private Route for the logged user only */}
        <Route 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
        >

        {/* Route for both student and instructor */}
        <Route path="dashboard/my-profile" element={<MyProfile />} />
        <Route path="dashboard/settings" element={<EditProfile />} />

        {/* Route only for the Instructor  */}
        {
          user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
            <Route path="dashboard/instructor" element={<Instructor />} />
            <Route path="dashboard/add-course/:id" element={<EditCourse />} />

          <Route path="dashboard/add-course" element={<AddCourse />} /> 
          <Route path="dashboard/my-courses" element={<MyCourses />} />
            </>
          )
        }


        {/* Route only for the student  */}
        {
          user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
            <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
            <Route path="dashboard/cart" element={<CartComponent />} />

            </>
          )
        }

        </Route>

        {/* for the watching course lectures */}
        <Route element={
          <PrivateRoute>
            <ViewCourse />
          </PrivateRoute>
        }>

        {
          user?.accountType === ACCOUNT_TYPE?.STUDENT && (
            <>
              <Route
              path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
              element={<VideoDetails />} />
            </>
          )
        }
          
        </Route>

      </Routes>
    </div>
  )
}

export default App;
