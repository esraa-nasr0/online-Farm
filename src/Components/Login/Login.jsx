import axios from "axios";
import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { UserContext } from "../../Context/UserContext";
import { jwtDecode } from "jwt-decode";
import style from "./Login.module.css";
import { CgShapeRhombus } from "react-icons/cg";

export default function Login() {
  let { setAuthorization } = useContext(UserContext);
  let navigate = useNavigate();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function submitLogin(value) {
    setIsLoading(true);

    try {
      let { data } = await axios.post(
        `https://farm-project-bbzj.onrender.com/api/login`,
        value
      );
      console.log(data);
      
      

      if (data.status === "success") {
        setIsLoading(false);
        const decodedToken = jwtDecode(data.data.token);

        // 🟢 خزّن التوكن + الدور
        localStorage.setItem("Authorization", data.data.token);
        localStorage.setItem("role", decodedToken.role);

        setAuthorization(data.data.token);

        const userRole = decodedToken.role;
        if (userRole === "admin") {
          navigate("/AdminDashboard");
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
    onSubmit: submitLogin,
    validateOnMount: true,
  });

  return (
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
          <button className={style.signInBtn} type="submit">
            Sign in
          </button>
          <div className={style.signupPrompt}>
            Don’t have an account? <Link to="/register">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
