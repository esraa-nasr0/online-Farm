import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";


export default function Register() {

  let navigate = useNavigate();
  const [error ,setError] = useState(null);
  const [isLoading , setisLoading] = useState(false);

  async function submitRegister(value) {
    setisLoading(true);
    try {
      let { data } = await axios.post(`https://farm-project-bbzj.onrender.com/api/register`, value);
      if (data.status === "success") {
        setisLoading(false);
        navigate('/login');
      }
    } catch (err) {
      setisLoading(false);
      console.log(err.response?.data); // Log the entire error response from the server
      setError(err.response?.data?.message || "A network error occurred");
    }
    
  }
  

  



    let phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    let validation = Yup.object({
      name: Yup.string()
        .min(3, 'name minlength is 3')
        .max(10, 'name maxlength is 10') // Updated to 'maxlength is 10' for consistency
        .required('name is required'),
        
      email: Yup.string()
        .email('email is invalid')
        .required('email is required'),
        
      phone: Yup.string() // Changed to string for phone validation
        .matches(phoneRegExp, 'Phone number is not valid')
        .required('phone is required'),
        
      country: Yup.string()
        .min(3, 'country minlength is 3')
        .max(50, 'country maxlength is 50') // Updated to 'maxlength is 50' for consistency
        .required('country is required'),
        
      password: Yup.string()
        .required('No password provided.') 
        .min(6, 'Password is too short - should be 6 chars minimum.')
        .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
        
      confirmpassword: Yup.string()
        .oneOf([Yup.ref("password")], 'Password and confirmation do not match')
        .required('password is required'),
    });
    

    let formik = useFormik({
      initialValues: {
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmpassword: '',
        usertype: '',  // Ensure 'usertype' is correctly initialized
        country: '',
      },
      validationSchema: validation,
      onSubmit: submitRegister
    });
    

    return <>
    <div className="body">
    <div className="container2">
        <div className="title">Registration</div>
        <p className="text-danger">{error}</p>
    <form onSubmit={formik.handleSubmit}>
        <div className="user-details">
          <div className="input-box">
            <label className="label" htmlFor="name">UserName</label>
            <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.name} placeholder="Enter your username" id="name" type="text" className="input" name="name"/>
            {formik.errors.name && formik.touched.name?<p className="text-danger">{formik.errors.name}</p>:""}
          </div>

          <div className="input-box">
            <label className="label" htmlFor="email">Email</label>
            <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.email} placeholder="Enter your email" id="email" type="text" className="input" name="email"/>
            {formik.errors.email && formik.touched.email?<p className="text-danger">{formik.errors.email}</p>:""}
          </div>

          <div className="input-box">
            <label className="label" htmlFor="phone">Phone Number</label>
            <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.phone} placeholder="Enter your number" id="phone" type="tel" className="input" name="phone"/>
            {formik.errors.phone && formik.touched.phone?<p className="text-danger">{formik.errors.phone}</p>:""}
          </div>

          <div className="input-box">
            <label className="label" htmlFor="country">Country</label>
            <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.country} placeholder="Enter your Country" id="country" type="text" className="input" name="country"/>
            {formik.errors.country && formik.touched.country?<p className="text-danger">{formik.errors.country}</p>:""}
          </div>

          <div className="input-box">
            <label className="label" htmlFor="password">Password</label>
            <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.password} placeholder="Enter your password" id="password" type="password" className="input" name="password"/>
            {formik.errors.password && formik.touched.password?<p className="text-danger">{formik.errors.password}</p>:""}
          </div>

          <div className="input-box">
            <label className="label" htmlFor='usertype'>User Type</label>
              <select 
              value={formik.values.usertype}
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur}
              className=" input" 
              name='usertype' 
              id='usertype' 
              aria-label="Default select example">
                      <option value="" >user type </option>
                      <option value="farm" >farm </option>
                      <option value="trader" >trader</option>
                  
                  </select>
          </div>

        <div className="input-box">
          <label className="label" htmlFor="confirmpassword">Confirm Password</label>
          <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.confirmpassword}  placeholder="Confirm your password" id="confirmpassword" type="password" className="input" name="confirmpassword"/>
          {formik.errors.confirmpassword && formik.touched.confirmpassword?<p className="text-danger">{formik.errors.confirmpassword}</p>:""}
        </div>
        </div>
        <div className="divbutton">
          {isLoading?
        <button  type="button" className="button">
          <i className="fas fa-spinner fa-spin"></i>
        </button>:
        <button disabled={!(formik.isValid && formik.dirty)} type="submit" className="button">Submit</button> }
        </div>
    </form>
    </div>
    </div>
    </>
}