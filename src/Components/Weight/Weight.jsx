import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from "yup";
import { IoIosSave } from "react-icons/io";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Weight() {
let navigate = useNavigate();
const [error, setError] = useState(null);
const [isLoading, setIsLoading] = useState(false);

let Authorization = localStorage.getItem('Authorization');
let headers = {
    Authorization: `Bearer ${Authorization}`,
};

async function submitWeight(value) {
    setIsLoading(true);
    setError(null);
    try {
    let { data } = await axios.post(
        `https://farm-project-bbzj.onrender.com/api/weight/AddWeight`,
        value,
        { headers }
    );
    if (data.status === "success") {
        setIsLoading(false);
        Swal.fire({
        title: 'Success!',
        text: 'Weight data added successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        });
        navigate('/weightTable');
    }
    } catch (err) {
    setIsLoading(false);
    setError(err.response?.data?.message || "An error occurred");
    }
}

let validation = Yup.object({
    tagId: Yup.string()
    .max(10, 'Tag ID cannot exceed 10 characters')
    .required('Tag ID is required'),
    weightType: Yup.string().required('Weight Type is required'),
    weight: Yup.string()
    .max(10, 'Weight cannot exceed 10 characters')
    .required('Weight is required'),
    height: Yup.string()
    .max(10, 'Height cannot exceed 10 characters')
    .required('Height is required'),
    Date: Yup.date().required('Date is required'),
});

let formik = useFormik({
    initialValues: {
    tagId: '',
    weightType: '',
    weight: '',
    height: '',
    Date: '',
    },
    validationSchema: validation,
    onSubmit: submitWeight,
});

return (
    <div className="container">
    <div className="title2">Weight</div>
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
            <label className="label" htmlFor="tagId">Tag ID</label>
            <input
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.tagId}
            placeholder="Enter Tag ID"
            id="tagId"
            type="text"
            className="input2"
            name="tagId"
            />
            {formik.errors.tagId && formik.touched.tagId && (
            <p className="text-danger">{formik.errors.tagId}</p>
            )}
        </div>

        <div className="input-box">
            <label className="label" htmlFor="weightType">Weight Type</label>
            <select
            value={formik.values.weightType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="input2"
            name="weightType"
            id="weightType"
            >
            <option value="">Select Weight Type</option>
            <option value="birth">Birth</option>
            <option value="weaning">Weaning</option>
            <option value="regular">Regular</option>
            </select>
            {formik.errors.weightType && formik.touched.weightType && (
            <p className="text-danger">{formik.errors.weightType}</p>
            )}
        </div>

        <div className="input-box">
            <label className="label" htmlFor="weight">Weight</label>
            <input
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.weight}
            placeholder="Enter Weight"
            id="weight"
            type="text"
            className="input2"
            name="weight"
            />
            {formik.errors.weight && formik.touched.weight && (
            <p className="text-danger">{formik.errors.weight}</p>
            )}
        </div>

        <div className="input-box">
            <label className="label" htmlFor="height">Height</label>
            <input
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.height}
            placeholder="Enter Height"
            id="height"
            type="text"
            className="input2"
            name="height"
            />
            {formik.errors.height && formik.touched.height && (
            <p className="text-danger">{formik.errors.height}</p>
            )}
        </div>

        <div className="input-box">
            <label className="label" htmlFor="Date">Date</label>
            <input
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.Date}
            id="Date"
            type="date"
            className="input2"
            name="Date"
            />
            {formik.errors.Date && formik.touched.Date && (
            <p className="text-danger">{formik.errors.Date}</p>
            )}
        </div>
        </div>
    </form>
    </div>
);
}

export default Weight;
