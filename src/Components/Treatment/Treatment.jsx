import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { IoIosSave } from "react-icons/io";
import * as Yup from 'yup';

function Treatment() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [treatmentData, setTreatmentData] = useState(null);

    
// Helper function to generate headers with the latest token
const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
  
    // Ensure the token has only one "Bearer" prefix
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
  
    return {
        Authorization: formattedToken
    };
  };

    async function submitTreatment(values) {
        const headers = getHeaders(); // Get the latest headers
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await axios.post(
                `https://farm-project-bbzj.onrender.com/api/treatment/addtreatment`,
                values,
                { headers }
            );

            if (data.status === "success") {
                setIsLoading(false);
                console.log(data.data.treatment);
                setTreatmentData(data.data.treatment);
                Swal.fire({
                    title: 'Success!',
                    text: 'Treatment data added successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
            }
        } catch (err) {
            setIsLoading(false);
            setError(err.response?.data?.message || 'An error occurred');
        }
    }
    
    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        type: Yup.string().required('Type is required'),
        volume: Yup.number().required('Volume is required').positive('Volume must be positive'),
        price: Yup.number().required('Price is required').positive('Price must be positive'),
    });

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
            <div className="title2">Treatment</div>
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
                            placeholder="Enter The Treatment Name"
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
                            placeholder="Enter The Treatment Type"
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
                            placeholder="Enter The Treatment Volume"
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
                            placeholder="Enter The Treatment Price"
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

export default Treatment;
