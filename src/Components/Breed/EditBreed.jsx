import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { IoIosSave } from "react-icons/io";
import axios from "axios";
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import {  useParams } from "react-router-dom";


function EditBreed() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
        const { id } = useParams(); // Get the animal ID from the URL params
    

    // Helper function to generate headers with the latest token
    const getHeaders = () => {
        const Authorization = localStorage.getItem("Authorization");
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return { Authorization: formattedToken };
    };

    async function submitBreed(values) {
        const headers = getHeaders();
        setIsLoading(true);
        setError(null);

        console.log("Sending data:", values);
        console.log("Headers:", headers);

        try {
            let { data } = await axios.patch(
                `https://farm-project-bbzj.onrender.com/api/breed/updatebreed/${id}`,
                values,
                { headers }
            );

            if (data.status === "success") {
                setIsLoading(false);
                Swal.fire({
                    title: "Success!",
                    text: "Breed added successfully!",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            }
        } catch (err) {
            setIsLoading(false);
            setError(err.response?.data?.message || "An error occurred");
        }
    }

    // **Formik Setup**
    let formik = useFormik({
        initialValues: {
            breedName: "", 
        },
        validationSchema: Yup.object({
            breedName: Yup.string().required("Breed Name is required"),
        }),
        onSubmit: submitBreed,
    });

    return (
        <div className="container">
            <div className="title2">{t('breed')}</div>
            <p className="text-danger">{error}</p>

            <form onSubmit={formik.handleSubmit} className="mt-5">
                {isLoading ? (
                    <button type="submit" className="btn button2" disabled>
                        <i className="fas fa-spinner fa-spin"></i>
                    </button>
                ) : (
                    <button type="submit" className="btn button2">
                        <IoIosSave /> Save
                    </button>
                )}

                <div className="animaldata">
                    <div className="input-box">
                        <label className="label" htmlFor="breedName">{t('breed')}</label>
                        <input 
                            onBlur={formik.handleBlur} 
                            onChange={formik.handleChange} 
                            value={formik.values.breedName} 
                            placeholder={t('enter_breed')} 
                            id="breedName" 
                            type="text" 
                            className="input2" 
                            name="breedName"
                        />
                        {formik.errors.breedName && formik.touched.breedName && (
                            <p className="text-danger">{formik.errors.breedName}</p>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditBreed;
