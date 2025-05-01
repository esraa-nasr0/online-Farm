import axios from "axios";
import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { UserContext } from "../../Context/UserContext";
import { jwtDecode } from 'jwt-decode';
import style from "./Login.module.css";

export default function Login() {
  let { setAuthorization } = useContext(UserContext);
  let navigate = useNavigate();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function submitLogin(value) {
    setIsLoading(true);

    try {
      let { data } = await axios.post(`https://farm-project-bbzj.onrender.com/api/login`, value);

      if (data.status === "success") {
        setIsLoading(false);
        const decodedToken = jwtDecode(data.data.token);
        localStorage.setItem("Authorization", data.data.token);
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
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  }

  let formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: submitLogin,
    validateOnMount: true, // Add this to ensure validation runs on mount
  });

  React.useEffect(() => {
    formik.setValues({
      email: '',
      password: ''
    });
    formik.setTouched({});
    formik.setErrors({});
  }, []);

  React.useEffect(() => {
    formik.resetForm();
    // Clear any potential stored values from localStorage/sessionStorage
    localStorage.removeItem('formData');
    sessionStorage.removeItem('formData');
  }, []);

  return (
    <div className={style.body}>
      <div className={style.container3}>
        <div className={style.title3}>Login</div>
        <p className="text-danger">{error}</p>
        <form onSubmit={formik.handleSubmit} className={style.content3}>
          <div className={style.user_details3}>
            <div className={style.input_box3}>
              <label htmlFor="email" className={style.details3}>Email</label>
              <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
                placeholder="Enter your email"
                id="email"
                type="text"
                name="email"
                className={style.input3}
              />
              {formik.errors.email && formik.touched.email ? (
                <p className="text-danger">{formik.errors.email}</p>
              ) : null}
            </div>

            <div className={style.input_box3}>
              <label htmlFor="password" className={style.details3}>Password</label>
              <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password}
                placeholder="Enter your password"
                id="password"
                type="password"
                name="password"
                className={style.input3}
              />
              {formik.errors.password && formik.touched.password ? (
                <p className="text-danger">{formik.errors.password}</p>
              ) : null}
            </div>
          </div>

          <div className={style.divbutton3}>
            {isLoading ? (
              <button type="button" className={style.button3}>
                <i className="fas fa-spinner fa-spin"></i>
              </button>
            ) : (
              <>
              
              <div className="d-flex justify-content-between mt-3">
                  <Link 
                  className="btn btn-link" 
                  to="/register"
                  onClick={() => {
                  formik.resetForm();
                  navigate('/register', { replace: true }); // Add replace option
                  }}>Register New
                  </Link>
                  <Link className="btn btn-link" to="/forgetpassword">
                    Forget Password
                  </Link>
                </div>
                
                <button
                  disabled={!(formik.isValid && formik.dirty)}
                  type="submit"
                  className={style.button3}
                >
                  Submit
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}