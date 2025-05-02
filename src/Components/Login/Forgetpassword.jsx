import axios from "axios";
import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import style from "./Login.module.css";

export default function Forgetpassword() {

let navigate = useNavigate();

const [error, setError] = useState(null);
const [isLoading, setIsLoading] = useState(false);

async function forgetpassword(value) {
    setIsLoading(true);

    try {
    let { data } = await axios.post(`https://farm-project-bbzj.onrender.com/api/forgetPassword`, value);

    if (data.status === "success") {

        navigate("/verifyotp"); 
        console.log(data);
        
    }
console.log(data);
console.log(value);

    }
    
    catch (err) {
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
    <div className={style.body}>
    <div className={style.container3}>
        <div className={style.title3}>Enter Your Email</div>
        <p className="text-danger">{error}</p>
        <form onSubmit={formik.handleSubmit} className={style.content3}>
        <div className={style.user_details3}>
            <div className={style.input_box3}>
            <label className={style.details3} htmlFor="email">Email</label>
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