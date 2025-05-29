import axios from "axios";
import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import * as Yup from "yup";
import style from "./Login.module.css";
import { CgShapeRhombus } from "react-icons/cg";

export default function Resetpassword() {
let { Authorization } = useContext(UserContext);
let navigate = useNavigate();

const [error, setError] = useState(null);
const [isLoading, setIsLoading] = useState(false);

async function Resetpassword(value) {
    setIsLoading(true);

    try {
    let { data } = await axios.post(
        `https://farm-project-bbzj.onrender.com/api/resetPassword`,
        value,
        {
        headers: {
            Authorization:`Bearer ${Authorization}`, 
        },
        }
    );

    if (data.status === "success") {
        setIsLoading(false);
        navigate("/login");
        console.log(data);
    }
    console.log(data);
    } catch (err) {
    setIsLoading(false);
    setError(err.response?.data?.message || "Reset password failed. Please try again.");
    }
}

let validation = Yup.object({
    newPassword: Yup.string()
    .required("No password provided.")
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
});

let formik = useFormik({
    initialValues: {
        newPassword: "",
    },
    validationSchema: validation,
    onSubmit: Resetpassword,
});

return (
    <div className={style.loginPageBg}>
        <div className={style.loginCard}>
            <div className={style.logo}><CgShapeRhombus /></div>
            <h2 className={style.title}>Reset your password</h2>
            <p className={style.subtitle}>Enter your new password below.</p>
            <p className="text-danger">{error}</p>
            <form onSubmit={formik.handleSubmit}>
                <label className={style.label} htmlFor="newPassword">New Password</label>
                <input
                    className={style.input}
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="Enter your new password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.newPassword}
                />
                {formik.errors.newPassword && formik.touched.newPassword ? (
                    <p className="text-danger">{formik.errors.newPassword}</p>
                ) : null}
                <button 
                    className={style.signInBtn} 
                    type="submit"
                    disabled={!(formik.isValid && formik.dirty)}
                >
                    {isLoading ? (
                        <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                        "Reset Password"
                    )}
                </button>
            </form>
        </div>
    </div>
);
}