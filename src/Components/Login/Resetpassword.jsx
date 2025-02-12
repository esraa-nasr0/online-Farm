import axios from "axios";
import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import * as Yup from "yup";


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
    <div className="body">
    <div className="container2">
        <div className="title">Reset password</div>
        <p className="text-danger">{error}</p>
        <form onSubmit={formik.handleSubmit}>
        <div className="user-detail">
    

            <div className="input-box2">
            <label className="label" htmlFor="newPassword">newPassword</label>
            <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password}
                placeholder="Enter your newPassword"
                id="newPassword"
                type="Password"
                className="input"
                name="newPassword"
            />
            {formik.errors.newPassword && formik.touched.newPassword ? (
                <p className="text-danger">{formik.errors.newPassword}</p>
            ) : null}
            </div>
        </div>

        <div className="divbutton">
            {isLoading ? (
            <button type="button" className="button">
                <i className="fas fa-spinner fa-spin"></i>
            </button>
            ) : (
            <>
                <button
                disabled={!(formik.isValid && formik.dirty)}
                type="submit"
                className="button"
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