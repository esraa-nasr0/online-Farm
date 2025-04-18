import axios from "axios";
import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { UserContext } from "../../Context/UserContext";
import style from "./Login.module.css";


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


    }
    
    catch (err) {
    setIsLoading(false);
    setError(err.response?.data?.message || "Login failed. Please try again.");
    }
}

let validation = Yup.object({
    verificationCode: Yup.string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits") // Ensures the OTP is exactly 6 digits
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
    <div className={style.body}>
    <div className={style.container3}>
        <div className={style.title3}>Enter verificationCode</div>
        <p className="text-danger">{error}</p>
        <form onSubmit={formik.handleSubmit} className={style.content3}>
        <div className={style.user_details3}>
            <div className={style.input_box3}>
            <label className={style.details3} htmlFor="verificationCode">verificationCode</label>
            <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.verificationCode}
                placeholder="Enter verification Code"
                id="verificationCode"
                type="text"
                className={style.input3}
                name="verificationCode"
            />
            {formik.errors.verificationCode && formik.touched.verificationCode ? (
                <p className="text-danger">{formik.errors.verificationCode}</p>
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
                <button
                disabled={!(formik.isValid && formik.dirty)}
                type="submit"
                className={style.button3}
                >
                Send
                </button>
            
            </>
            )}
        </div>
        </form>
    </div>
    </div>
);
}