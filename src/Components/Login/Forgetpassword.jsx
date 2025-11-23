import axios from "axios";
import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import style from "./Login.module.css";
import { CgShapeRhombus } from "react-icons/cg";

export default function Forgetpassword() {
let navigate = useNavigate();

const [error, setError] = useState(null);
const [isLoading, setIsLoading] = useState(false);

async function forgetpassword(value) {
    setIsLoading(true);

    try {
    let { data } = await axios.post(`https://api.mazraaonline.com/api/forgetPassword`, value);

    if (data.status === "success") {
        navigate("/verifyotp"); 
        console.log(data);
    }
    console.log(data);
    console.log(value);
    } catch (err) {
    setIsLoading(false);
    setError(err.response?.data?.message || "Login failed. Please try again.");
    }
}

let validation = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
});

let formik = useFormik({
    initialValues: {
        email: "",
    },
    validationSchema: validation,
    onSubmit: forgetpassword,
});

return (
    <div className={style.loginPageBg}>
        <div className={style.loginCard}>
            <div className={style.logo}><CgShapeRhombus /></div>
            <h2 className={style.title}>Reset your password</h2>
            <p className={style.subtitle}>Enter your email to receive a verification code.</p>
            <p className="text-danger">{error}</p>
            <form onSubmit={formik.handleSubmit}>
                <label className={style.label} htmlFor="email">Email</label>
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
                    <p className="text-danger">{formik.errors.email}</p>
                ) : null}
                <button 
                    className={style.signInBtn} 
                    type="submit"
                    disabled={!(formik.isValid && formik.dirty)}
                >
                    {isLoading ? (
                        <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                        "Send Code"
                    )}
                </button>
            </form>
        </div>
    </div>
);
}