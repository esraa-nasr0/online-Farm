import axios from "axios";
import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { UserContext } from "../../Context/UserContext";
import style from "./Login.module.css";
import { CgShapeRhombus } from "react-icons/cg";

export default function Verifyotp() {
let { setAuthorization } = useContext(UserContext);
let navigate = useNavigate();

const [error, setError] = useState(null);
const [isLoading, setIsLoading] = useState(false);

async function Verifyotp(value) {
    setIsLoading(true);

    try {
    let { data } = await axios.post(`https://farm-project-bbzj.onrender.com/api/verifyCode`, value);

    if (data.status === "success") {
        localStorage.setItem("Authorization", data.token);
        setAuthorization(data.token);
        navigate("/resetpassword"); 
        console.log(data);
    }
    console.log(data.token);
    } catch (err) {
    setIsLoading(false);
    setError(err.response?.data?.message || "Login failed. Please try again.");
    }
}

let validation = Yup.object({
    verificationCode: Yup.string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("Verification code is required"),
});

let formik = useFormik({
    initialValues: {
        verificationCode: "",
    },
    validationSchema: validation,
    onSubmit: Verifyotp,
});

return (
    <div className={style.loginPageBg}>
        <div className={style.loginCard}>
            <div className={style.logo}><CgShapeRhombus /></div>
            <h2 className={style.title}>Verify your code</h2>
            <p className={style.subtitle}>Enter the 6-digit code sent to your email.</p>
            <p className="text-danger">{error}</p>
            <form onSubmit={formik.handleSubmit}>
                <label className={style.label} htmlFor="verificationCode">Verification Code</label>
                <input
                    className={style.input}
                    id="verificationCode"
                    name="verificationCode"
                    type="text"
                    placeholder="Enter 6-digit code"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.verificationCode}
                />
                {formik.errors.verificationCode && formik.touched.verificationCode ? (
                    <p className="text-danger">{formik.errors.verificationCode}</p>
                ) : null}
                <button 
                    className={style.signInBtn} 
                    type="submit"
                    disabled={!(formik.isValid && formik.dirty)}
                >
                    {isLoading ? (
                        <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                        "Verify Code"
                    )}
                </button>
            </form>
        </div>
    </div>
);
}