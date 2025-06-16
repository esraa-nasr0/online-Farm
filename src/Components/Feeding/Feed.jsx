import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { IoIosSave } from "react-icons/io";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import './Feeding.css';

export default function Feed() {
    const [isLoading, setIsLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return { Authorization: formattedToken };
    };

    async function handleSubmit(values) {
        const headers = getHeaders();
        try {
            setIsLoading(true);
            const dataToSubmit = {
                ...values,
            };

            const { data } = await axios.post(
                "https://farm-project-bbzj.onrender.com/api/feed/addfeed",
                dataToSubmit,
                { headers }
            );

            if (data.status === "success") {
                setIsLoading(false);
                setShowAlert(true);
                Swal.fire({
                    title: "Success!",
                    text: "Data has been submitted successfully!",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then(() => navigate('/feedingTable'));
            }
        } catch (err) {
            Swal.fire({
                title: "Error!",
                text: err.response?.data?.message || "An error occurred while submitting data.",
                icon: "error",
                confirmButtonText: "OK",
            });
        } finally {
            setIsLoading(false);
        }
    }

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        type: Yup.string().required("Type is required"),
        price: Yup.number().required("Price is required"),
        concentrationOfDryMatter: Yup.number().required("Concentration of Dry Matter is required"),
        quantity: Yup.number().required("quantity is required"),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            type: "",
            price: "",
            concentrationOfDryMatter: "",
            quantity: "",
        },
        validationSchema,
        onSubmit: handleSubmit,
    });

    return (
        <div className="feeding-container">
            <div className="feeding-header">
                <h1>Add Feed</h1>
            </div>

            <form onSubmit={formik.handleSubmit} className="feeding-form">
                <div className="form-grid">
                    <div className="form-section">
                        <h2>Feed Information</h2>
                        <div className="input-group">
                            <label htmlFor="name">Name</label>
                            <input
                                {...formik.getFieldProps("name")}
                                placeholder="Enter feed name"
                                id="name"
                                type="text"
                            />
                            {formik.touched.name && formik.errors.name && (
                                <p className="text-danger">{formik.errors.name}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="type">Type</label>
                            <input
                                {...formik.getFieldProps("type")}
                                placeholder="Enter feed type"
                                id="type"
                                type="text"
                            />
                            {formik.touched.type && formik.errors.type && (
                                <p className="text-danger">{formik.errors.type}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="price">Price/ton</label>
                            <input
                                {...formik.getFieldProps("price")}
                                placeholder="Enter price"
                                id="price"
                                type="text"
                            />
                            {formik.touched.price && formik.errors.price && (
                                <p className="text-danger">{formik.errors.price}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="concentrationOfDryMatter">Concentration of Dry Matter (percentage %)</label>
                            <input
                                {...formik.getFieldProps("concentrationOfDryMatter")}
                                placeholder="Enter concentration of dry matter"
                                id="concentrationOfDryMatter"
                                type="text"
                            />
                            {formik.touched.concentrationOfDryMatter && formik.errors.concentrationOfDryMatter && (
                                <p className="text-danger">{formik.errors.concentrationOfDryMatter}</p>
                            )}
                        </div>
                        
                        <div className="input-group">
                            <label htmlFor="quantity">Quantity (ton)</label>
                            <input
                                {...formik.getFieldProps("quantity")}
                                placeholder="Enter Quantity"
                                id="quantity"
                                type="text"
                            />
                            {formik.touched.quantity && formik.errors.quantity && (
                                <p className="text-danger">{formik.errors.quantity}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="save-button" disabled={isLoading}>
                        {isLoading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            <>
                                <IoIosSave /> Save
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
