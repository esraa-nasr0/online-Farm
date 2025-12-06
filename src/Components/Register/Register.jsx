import axiosInstance from "../../api/axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as Yup from "yup";
import style from "./Register.module.css";
import { jwtDecode } from "jwt-decode";
import { CgShapeRhombus } from "react-icons/cg";

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  async function submitRegister(value) {
    setisLoading(true);
    try {
      const { data } = await axiosInstance.post("/register", value);
      if (data.status === "success") {
        setisLoading(false);
        formik.resetForm();
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

    email: Yup.string().email("email is invalid").required("email is required"),

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
      registerationType: null,
    },
    validationSchema: validation,
    onSubmit: submitRegister,
    validateOnMount: true,
  });

  React.useEffect(() => {
    formik.resetForm();
    localStorage.removeItem("formData");
    sessionStorage.removeItem("formData");
  }, []);

  return (
    <div className={style.loginPageBg}>
      <div className={style.loginCard}>
        <div className={style.logo}>
          <CgShapeRhombus />
        </div>
        <h2 className={style.title}>Create an account</h2>
        <p className={style.subtitle}>
          Please fill in your details to register.
        </p>
        <p className="text-danger">{error}</p>
        <form onSubmit={formik.handleSubmit}>
          <div className={style.formGrid}>
            <div className={style.inputGroup}>
              <label className={style.label} htmlFor="email">
                Email
              </label>
              <input
                className={style.input}
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.errors.email && formik.touched.email ? (
                <p className={`text-danger ${style.errorText}`}>
                  {formik.errors.email}
                </p>
              ) : null}
            </div>

            <div className={style.inputGroup}>
              <label className={style.label} htmlFor="name">
                Username
              </label>
              <input
                className={style.input}
                id="name"
                name="name"
                type="text"
                placeholder="Enter your username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.errors.name && formik.touched.name ? (
                <p className={`text-danger ${style.errorText}`}>
                  {formik.errors.name}
                </p>
              ) : null}
            </div>

            <div className={style.inputGroup}>
              <label className={style.label} htmlFor="phone">
                Phone Number
              </label>
              <input
                className={style.input}
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
              />
              {formik.errors.phone && formik.touched.phone ? (
                <p className={`text-danger ${style.errorText}`}>
                  {formik.errors.phone}
                </p>
              ) : null}
            </div>

            <div className={style.inputGroup}>
              <label className={style.label} htmlFor="country">
                Country
              </label>
              <input
                className={style.input}
                id="country"
                name="country"
                type="text"
                placeholder="Enter your country"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.country}
              />
              {formik.errors.country && formik.touched.country ? (
                <p className={`text-danger ${style.errorText}`}>
                  {formik.errors.country}
                </p>
              ) : null}
            </div>

            <div className={style.inputGroup}>
              <label className={style.label} htmlFor="password">
                Password
              </label>
              <input
                className={style.input}
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.errors.password && formik.touched.password ? (
                <p className={`text-danger ${style.errorText}`}>
                  {formik.errors.password}
                </p>
              ) : null}
            </div>

            <div className={style.inputGroup}>
              <label className={style.label} htmlFor="confirmpassword">
                Confirm Password
              </label>
              <input
                className={style.input}
                id="confirmpassword"
                name="confirmpassword"
                type="password"
                placeholder="Confirm your password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmpassword}
              />
              {formik.errors.confirmpassword &&
              formik.touched.confirmpassword ? (
                <p className={`text-danger ${style.errorText}`}>
                  {formik.errors.confirmpassword}
                </p>
              ) : null}
            </div>

            <div className={style.inputGroup}>
              <label className={style.label} htmlFor="registerationType">
                Farm Type
              </label>
              <select
                id="registerationType"
                name="registerationType"
                value={formik.values.registerationType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={style.input}
              >
                <option value="">select Farm Type</option>
                <option value="fattening">fattening</option>
                <option value="breeding">breeding</option>
              </select>
              {formik.errors.registerationType &&
              formik.touched.registerationType ? (
                <p className={`text-danger ${style.errorText}`}>
                  {formik.errors.registerationType}
                </p>
              ) : null}
            </div>
          </div>

          <button
            className={style.signInBtn}
            type="submit"
            disabled={!(formik.isValid && formik.dirty)}
          >
            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : "Sign up"}
          </button>

          <div className={style.signupPrompt}>
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
