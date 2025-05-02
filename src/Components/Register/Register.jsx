import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import style from "./Register.module.css";
import { jwtDecode } from 'jwt-decode';


export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  async function submitRegister(value) {
    setisLoading(true);
    try {
      const { data } = await axios.post(
        "https://farm-project-bbzj.onrender.com/api/register",
        value
      );
      if (data.status === "success") {
        setisLoading(false);
        formik.resetForm(); // Reset before navigating
        navigate("/login");
      }
    } catch (err) {
      setisLoading(false);
      console.log(err.response?.data);
      setError(err.response?.data?.message || "A network error occurred");
    }
  }

  const phoneRegExp =
    /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;

  const validation = Yup.object({
    name: Yup.string()
      .min(3, "name minlength is 3")
      .max(50, "name maxlength is 50")
      .required("name is required"),

    email: Yup.string()
      .email("email is invalid")
      .required("email is required"),

    phone: Yup.string()
      .matches(phoneRegExp, "Phone number is not valid")
      .required("phone is required"),

    country: Yup.string()
      .min(3, "country minlength is 3")
      .max(50, "country maxlength is 50")
      .required("country is required"),

    password: Yup.string()
      .required("No password provided.")
      .min(6, "Password is too short - should be 6 chars minimum.")
      .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),

    confirmpassword: Yup.string()
      .oneOf([Yup.ref("password")], "Password and confirmation do not match")
      .required("password is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmpassword: "",
      country: "",
    },
    validationSchema: validation,
    onSubmit: submitRegister,
    validateOnMount: true, // Add this
  });
  
  React.useEffect(() => {
    formik.resetForm();
    // Clear any potential stored values from localStorage/sessionStorage
    localStorage.removeItem('formData');
    sessionStorage.removeItem('formData');
  }, []);


  return (
    <div className={style.body}>
      <div className={style.container3}>
        <div className={style.content3}>
          <div className={style.title3}>Registration</div>
          <p className="text-danger">{error}</p>
          <form onSubmit={formik.handleSubmit}>
            <div className={style.user_details3}>
              <div className={style.input_box3}>
                <label className={style.details3} htmlFor="name">
                  UserName
                </label>
                <input
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  placeholder="Enter your username"
                  id="name"
                  type="text"
                  className={style.input3}
                  name="name"
                />
                {formik.errors.name && formik.touched.name ? (
                  <p className="text-danger">{formik.errors.name}</p>
                ) : (
                  ""
                )}
              </div>

              <div className={style.input_box3}>
                <label className={style.details3} htmlFor="email">
                  Email
                </label>
                <input
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  placeholder="Enter your email"
                  id="email"
                  type="text"
                  className={style.input3}
                  name="email"
                />
                {formik.errors.email && formik.touched.email ? (
                  <p className="text-danger">{formik.errors.email}</p>
                ) : (
                  ""
                )}
              </div>

              <div className={style.input_box3}>
                <label className={style.details3} htmlFor="phone">
                  Phone Number
                </label>
                <input
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                  placeholder="Enter your number"
                  id="phone"
                  type="tel"
                  className={style.input3}
                  name="phone"
                />
                {formik.errors.phone && formik.touched.phone ? (
                  <p className="text-danger">{formik.errors.phone}</p>
                ) : (
                  ""
                )}
              </div>

              <div className={style.input_box3}>
                <label className={style.details3} htmlFor="country">
                  Country
                </label>
                <input
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.country}
                  placeholder="Enter your Country"
                  id="country"
                  type="text"
                  className={style.input3}
                  name="country"
                />
                {formik.errors.country && formik.touched.country ? (
                  <p className="text-danger">{formik.errors.country}</p>
                ) : (
                  ""
                )}
              </div>

              <div className={style.input_box3}>
                <label className={style.details3} htmlFor="password">
                  Password
                </label>
                <input
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  placeholder="Enter your password"
                  id="password"
                  type="password"
                  className={style.input3}
                  name="password"
                />
                {formik.errors.password && formik.touched.password ? (
                  <p className="text-danger">{formik.errors.password}</p>
                ) : (
                  ""
                )}
              </div>


              <div className={style.input_box3}>
                <label className={style.details3} htmlFor="confirmpassword">
                  Confirm Password
                </label>
                <input
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.confirmpassword}
                  placeholder="Confirm your password"
                  id="confirmpassword"
                  type="password"
                  className={style.input3}
                  name="confirmpassword"
                />
                {formik.errors.confirmpassword &&
                formik.touched.confirmpassword ? (
                  <p className="text-danger">
                    {formik.errors.confirmpassword}
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className={style.divbutton}>
              {isLoading ? (
                <button type="button" className={style.button3}>
                  <i className="fas fa-spinner fa-spin"></i>
                </button>
              ) : (
                <button
                  disabled={!(formik.isValid && formik.dirty)}
                  type="submit"
                  className={style.button3}
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
