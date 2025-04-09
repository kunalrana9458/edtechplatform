import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { apiconnector } from "../../services/apiconnector";
import countrycode from '../../data/countrycode.json'

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phoneno: "",
      });
    }
  }, [reset, isSubmitSuccessful]);

  const submitContactForm = async (data) => {
    console.log("Logg data", data);
    try {
      setLoading(true);
      // const response = await apiconnector("POST");
      const response = { status: "200" };
      console.log("LOGGING RESPONSE", response);
      setLoading(false);
    } catch (error) {
      console.log("Error:", error.message);
      setLoading(false);
    }
  };

  return (
    <form action="" onSubmit={handleSubmit(submitContactForm)}>
      <div className="flex flex-col">
        {/* firstname  */}
        <div className="flex gap-x-5">
          <label htmlFor="firstname">First Name</label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            placeholder="Enter first name"
            className="text-black"
            {...register("firstname", { required: true })}
          />
          {errors.firstname && <span>Please Enter your First Name</span>}
        </div>

        {/* lastname  */}

        <div className="flex gap-x-5">
          <label htmlFor="lastname">Last Name</label>
          <input
            type="text"
            name="lastname"
            id="lastname"
            placeholder="Enter first name"
            {...register("lastname")}
            className="text-black"
          />
        </div>

        {/* email  */}

        <div className="flex flex-col">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email Address"
            {...register("email", { required: true })}
            className="text-black"
          />

          {errors.email && <span>Please Enter your email Address</span>}
        </div>

        {/* phone number  */}
        <div className="flex flex-col gap-2">
          <label htmlFor="phonenumber">
            Phone Number
          </label>
          <div className="flex flex-row gap-5">
            {/* droup dowm  */}
            <div className="flex w-[80px]">
              <select
              name="dropdown"
              id="dropdown"
              className="bg-richblack-500"
              {...register("countrycode",{required:true})} >
                 {
                  countrycode.map((element,index) => {
                    return (
                      <option
                      key={index}
                      value={element.code}
                      className="bg-richblack-500"
                      > {element.code} "-" {element.country} </option>
                    )
                  })
                 }
              </select>
            </div>

            <div>
              <input
              type="text"
              name="phonenumber"
              id="phonenumber"
              placeholder="1234 567 890"
              className="text-black"
              {...register("phonenumber",
              {required:{value:true,message:"Please Enter Phone Number"},
              maxLength:{value:10,message:"Invalid Phone Number"},
              minLength:{value:8,message:"Invalid Phone Number"}
              })} />
            </div>
          </div>
          {
            errors.phonenumber && (
              <span>
                {
                  errors.phonenumber.message
                }
              </span>
            )
          }
        </div>

        {/* message   */}
        <div className="flex flex-col">
          <label htmlFor="message">Enter Your Message</label>
          <textarea
            name="message"
            id="message"
            cols="30"
            rows="7"
            className="text-black"
            placeholder="Enter your message"
            {...register("message", { required: true })}
          />
          {errors.message && <span>Please Enter Your Message</span>}
        </div>
      </div>
      <button
        type="submit"
        className="rounded-md text-black bg-yellow-50 text-center text-[16px] p-2"
      >
        Send Message
      </button>
    </form>
  );
};

export default ContactUsForm;
