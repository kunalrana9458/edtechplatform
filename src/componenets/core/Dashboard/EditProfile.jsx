import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "../../common/IconButton";
import { VscCloudUpload } from "react-icons/vsc";
import {updateDisplayPicture} from '../../../services/operations/settingsAPIs'
import {updateProfileDetails} from '../../../services/operations/settingsAPIs'

const EditProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const {token} = useSelector((state) => state.auth)
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();

  const [editFormData,setEditFormData] = useState({
    dateOfBirth:"",
    about:"",
    contactNumber:"",
  })

  const{dateOfBirth,about,contactNumber} = editFormData

  const handleOnImageChange = (event, setImage) => {
    const file = event.target.files[0];

    if (file) {
      console.log("Selected File:",file)
      setImage(file)
    }
  };

  const imageSubmitHandler = (event, image) => {
    event.preventDefault();

    if (!image) {
      alert("Please Select an image");
      return;
    }

    try {
      // prepare form data for upload
      const formData = new FormData();
  formData.append("displayPicture", image); // ✅ Append File, NOT Base64
  console.log("FormData Content:", formData.get("displayPicture")); // ✅ Debugging

  dispatch(updateDisplayPicture(formData,token));
    } catch (error) {}
  };

  const handleOnChange = (e) => {
    setEditFormData((prevData) => ({
      ...prevData,
      [e.target.name]:e.target.value
    }))
  }

  const submitHandler = (e) => {
    e.preventDefault()
    console.log("Edit FormData",editFormData)
    dispatch(updateProfileDetails(dateOfBirth,about,contactNumber,token))

    // Reset the form
    setEditFormData({
      dateOfBirth:"",
      about:"",
      contactNumber:"",
    });

  }

  return (
    <div className="flex flex-col gap-8">
      {/* section 1 */}
      <h1 className="text-2xl font-bold text-richblack-5"> Edit Profile </h1>
      <div className="bg-richblack-800 p-8 rounded-lg flex gap-6 items-center">
        <div>
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[78px] rounded-full object-cover"
          />
        </div>
        <div>
          <p className="text-richblack-200 text-lg">Change Profile Photo</p>
          <div className="flex gap-4 items-center mt-5">
            <div>
              <form onSubmit={(event) => imageSubmitHandler(event, image)}>
                <input
                  type="file"
                  accept="image/*"
                  id="displayPicture"
                  onChange={(event) => {
                    handleOnImageChange(event, setImage);
                  }}
                />
                {/* <label
                  htmlFor="imageinput"
                  className="cursor-pointer bg-richblack-700 text-white p-3 rounded-lg shadow hover:bg-richblack-600 duration-200"
                >
                  Select
                </label> */}
                <IconButton>
                  Upload
                  <VscCloudUpload />
                </IconButton>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* section 2 */}

      <div className="bg-richblack-800 rounded-lg p-6">
        <h2 className="text-richblack-100 text-lg font-semibold">
          Profile Information
        </h2>
        <form 
        action=""
        className="flex flex-col gap-4"
        onSubmit={submitHandler} >
          <div className="flex gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="firstname"
                className="text-richblack-100 text-sm font-bold"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                className="bg-richblack-700 text-richblack-50"
                value={user.firstName}
                disabled
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="lastname"
                className="text-richblack-100 text-sm font-bold"
              >
                Last Name
              </label>
              <input
                className="bg-richblack-700 text-richblack-50"
                type="text"
                id="lastname"
                name="lastname"
                value={user.lastName}
                disabled
              />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="dateOfBirth"
                className="text-richblack-100 text-sm font-bold"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={editFormData.dateOfBirth}
                onChange={handleOnChange}
                className="bg-richblack-700 text-richblack-50"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="gender"
                className="text-richblack-100 text-sm font-bold"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                // value={gender}
                // onChange={(e) => setGender(e.target.value)}
                className={`p-2 rounded-md text-black 
         "bg-blue-500" : gender === "Female" ? "bg-pink-500" : "bg-richblack-700"}
        `}
              >
                <option value="" className="text-black">
                  Select Gender
                </option>
                <option value="Male" className="text-black">
                  Male
                </option>
                <option value="Female" className="text-black">
                  Female
                </option>
              </select>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="contactNumber"
                className="text-richblack-100 text-sm font-bold"
              >
                Contact Number
              </label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                value={editFormData.contactNumber}
                onChange={handleOnChange}
                className="bg-richblack-700 text-richblack-50"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="about"
                className="text-richblack-100 text-sm font-bold"
              >
                About
              </label>
              <input
                className="bg-richblack-700 text-richblack-50"
                type="text"
                id="about"
                name="about"
                value={editFormData.about}
                onChange={handleOnChange}
              />
            </div>
          </div>
        </form>

        <div className="flex gap-5 pt-6 justify-end">
          <button className="bg-richblack-700 text-richblack-5 px-2 rounded-lg">
            Cancel
          </button>
          <IconButton 
          text="Save"
          type='submit'
          onclick={submitHandler} />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
