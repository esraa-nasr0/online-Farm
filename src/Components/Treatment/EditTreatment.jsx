import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { IoIosSave } from "react-icons/io";
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';

function EditTreatment() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();

    const Authorization = localStorage.getItem('Authorization');
    const headers = { Authorization: `Bearer ${Authorization}` };

    // Submit the updated treatment data
    async function submitTreatment(values) {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await axios.patch(
                `https://farm-project-bbzj.onrender.com/api/treatment/updatetreatment/${id}`,
                values,
                { headers }
            );

            if (data.status === "success") {
                Swal.fire({
                    title: 'Success!',
                    text: 'Treatment updated successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    }

    // Fetch the treatment data
    useEffect(() => {
        async function fetchTreatment() {
            setError(null);
            try {
                const { data } = await axios.get(
                    `https://farm-project-bbzj.onrender.com/api/treatment/getsingletreatment/${id}`,
                    { headers }
                );
                console.log("API response:", data);

                if (data && data.data && data.data.treatment) {
                    const treatment = data.data.treatment;

                    // Populate Formik with the fetched data
                    formik.setValues({
                        name: treatment.name || '',
                        type: treatment.type || '',
                        volume: treatment.volume || '',
                        price: treatment.price || '',
                    });
                } else {
                    throw new Error("Unexpected API response structure");
                }
            } catch (error) {
                console.error("Failed to fetch treatment data:", error);
                setError("Failed to fetch treatment details.");
            }
        }
        fetchTreatment();
    }, [id]);

    // Validation schema for Formik
    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        type: Yup.string().required('Type is required'),
        volume: Yup.number().required('Volume is required').positive('Volume must be positive'),
        price: Yup.number().required('Price is required').positive('Price must be positive'),
    });

    // Initialize Formik
    const formik = useFormik({
        initialValues: {
            name: "",
            type: "",
            volume: "",
            price: "",
        },
        validationSchema,
        onSubmit: submitTreatment,
    });

    return (
        <div className='container'>
            <div className="title2">Edit Treatment</div>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={formik.handleSubmit} className='mt-5'>
                {isLoading ? (
                    <button type="submit" className="btn button2" disabled>
                        <i className="fas fa-spinner fa-spin"></i>
                    </button>
                ) : (
                    <button type="submit" className="btn button2">
                        <IoIosSave /> Save
                    </button>
                )}

                <div className='animaldata'>
                    <div className="input-box">
                        <label className="label" htmlFor="name">Name</label>
                        <input
                            autoComplete="off"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.name}
                            id="name"
                            type="text"
                            className="input2"
                            name="name"
                            aria-label="Treatment Name"
                        />
                        {formik.errors.name && formik.touched.name && <p className="text-danger">{formik.errors.name}</p>}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="type">Type</label>
                        <input
                            autoComplete="off"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.type}
                            id="type"
                            type="text"
                            className="input2"
                            name="type"
                            aria-label="Treatment Type"
                        />
                        {formik.errors.type && formik.touched.type && <p className="text-danger">{formik.errors.type}</p>}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="volume">Volume</label>
                        <input
                            autoComplete="off"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.volume}
                            id="volume"
                            type="number"
                            className="input2"
                            name="volume"
                            aria-label="Treatment Volume"
                        />
                        {formik.errors.volume && formik.touched.volume && <p className="text-danger">{formik.errors.volume}</p>}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="price">Price</label>
                        <input
                            autoComplete="off"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.price}
                            id="price"
                            type="number"
                            className="input2"
                            name="price"
                            aria-label="Treatment Price"
                        />
                        {formik.errors.price && formik.touched.price && <p className="text-danger">{formik.errors.price}</p>}
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditTreatment;
