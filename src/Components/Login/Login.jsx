import axiosInstance from "../../api/axios";
import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { UserContext } from "../../Context/UserContext";
import { jwtDecode } from "jwt-decode";
import { setToken } from "../../utils/authToken";
import style from "./Login.module.css";
import { CgShapeRhombus } from "react-icons/cg";
import SEO from "../SEO/SEO";

export default function Login() {
  let { setAuthorization } = useContext(UserContext);
  let navigate = useNavigate();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function submitLogin(value) {
    setIsLoading(true);

    try {
      let { data } = await axiosInstance.post(`/login`, value);

      if (data.status === "success") {
        setIsLoading(false);
        const decodedToken = jwtDecode(data.data.token);
        setToken(data.data.token);
        setAuthorization(data.data.token);
        console.log("Decoded Token:", decodedToken);
        const userRole = decodedToken.role;

        if (userRole === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setIsLoading(false);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  }

  let formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Please enter a valid email address")
        .required("Email is required"),

      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),

    onSubmit: submitLogin,
  });

  React.useEffect(() => {
    formik.setValues({
      email: "",
      password: "",
    });
    formik.setTouched({});
    formik.setErrors({});
  }, []);

  React.useEffect(() => {
    formik.resetForm();
    // Clear any potential stored values from localStorage/sessionStorage
    localStorage.removeItem("formData");
    sessionStorage.removeItem("formData");
  }, []);

  return (
    <>
      <SEO
        title="Login"
        description="Log in to your farm management account to access your dashboard, track animals, manage breeding, and monitor your livestock health."
        keywords="farm login, farm management login, livestock management login"
      />
      <div className={style.loginPageBg}>
        <div className={style.loginCard}>
        <div className={style.logo}>
          <CgShapeRhombus />
        </div>
        <h2 className={style.title}>Log in to your account</h2>
        <p className={style.subtitle}>
          Welcome back! Please enter your details.
        </p>
        <form onSubmit={formik.handleSubmit}>
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

          <label className={style.label} htmlFor="password">
            Password
          </label>
          <input
            className={style.input}
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.errors.password && formik.touched.password ? (
            <p className={`text-danger ${style.errorText}`}>
              {formik.errors.password}
            </p>
          ) : null}

          <div className={style.optionsRow}>
            <label className={style.checkboxLabel}>
              <input type="checkbox" name="remember" />
              Remember me
            </label>
            <Link className={style.forgotLink} to="/forgetpassword">
              Forgot password
            </Link>
          </div>

          <button className={style.signInBtn} type="submit">
            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : "Sign in"}
          </button>

          <div className={style.signupPrompt}>
            Don’t have an account? <Link to="/register">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
