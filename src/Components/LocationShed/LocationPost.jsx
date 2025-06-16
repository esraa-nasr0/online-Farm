import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { IoIosSave } from "react-icons/io";
import axios from "axios";
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import {  useNavigate} from "react-router-dom";



function LocationPost() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
        const { t } = useTranslation();
    const navigate = useNavigate();
    

    // Helper function to generate headers with the latest token
    const getHeaders = () => {
        const Authorization = localStorage.getItem("Authorization");
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return { Authorization: formattedToken };
    };

    async function submitLocation(values) {
        const headers = getHeaders();
        setIsLoading(true);
        setError(null);

        console.log("Sending data:", values);
        console.log("Headers:", headers);

        try {
            let { data } = await axios.post(
                `https://farm-project-bbzj.onrender.com/api/location/addlocationshed`,
                values,
                { headers }
            );

            if (data.status === "success") {
                setIsLoading(false);
                Swal.fire({
                    title: "Success!",
                    text: "Location data added successfully!",
                    icon: "success",
                    confirmButtonText: "OK",
                });
                navigate("/locationTable"); // Redirect to the location table after successful submission
            }
        } catch (err) {
            setIsLoading(false);
            setError(err.response?.data?.message || "An error occurred");
        }
    }

    // **Formik Setup**
    let formik = useFormik({
        initialValues: {
            locationShedName: "", 
        },
        validationSchema: Yup.object({
            locationShedName: Yup.string().required("Location Shed is required"),
        }),
        onSubmit: submitLocation,
    });

    return (
        <div className="container">
            <div className="title2">Location Shed</div>
            <p className="text-danger">{error}</p>

            <form onSubmit={formik.handleSubmit} className="mt-5">
                {isLoading ? (
                    <button type="submit" className="btn button2">
                        <i className="fas fa-spinner fa-spin"></i>
                    </button>
                ) : (
                    <button type="submit" className="btn button2">
                        <IoIosSave /> Save
                    </button>
                )}

                <div className="animaldata">
                    <div className="input-box">
                        <label className="label" htmlFor="locationShedName">
                        {t('location_shed')}
                        </label>
                        <input
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.locationShedName} 
                            placeholder="Enter Location Shed"
                            id="locationShedName"
                            type="text"
                            className="input2"
                            name="locationShedName" 
                        />
                        {formik.errors.locationShedName && formik.touched.locationShedName && (
                            <p className="text-danger">{formik.errors.locationShedName}</p>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}

export default LocationPost;
