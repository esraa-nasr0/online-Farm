import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { IoIosSave } from "react-icons/io";
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';

function EditTreatAnimal() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();

    const Authorization = localStorage.getItem('Authorization');
    const headers = { Authorization: `Bearer ${Authorization}` };

    // تحويل التاريخ من ISO إلى YYYY-MM-DD
    const formatDate = (isoString) => {
        if (!isoString) return "";
        return isoString.split("T")[0]; // استخراج الجزء الأول فقط YYYY-MM-DD
    };

    // Submit the updated treatment data
    async function submitTreatment(values) {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await axios.patch(
                `https://farm-project-bbzj.onrender.com/api/treatment/updatetreatmentforAnimals/${id}`,
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
                    `https://farm-project-bbzj.onrender.com/api/treatment/getsingletreatmentforAnimals/${id}`,
                    { headers }
                );
                console.log("API response:", data);

                if (data && data.data && data.data.treatmentShed) {
                    const treatment = data.data.treatmentShed;

                    // Populate Formik with the fetched data
                    formik.setValues({
                        tagId: treatment.tagId || '',
                        locationShed: treatment.locationShed || '',
                        treatmentName: treatment.treatments[0]?.treatmentName || '',
                        volume: treatment.treatments[0]?.volume || '',
                        date: formatDate(treatment.date) || '', // تحويل التاريخ هنا
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
        tagId: Yup.string().required('Tag ID is required'),
        locationShed: Yup.string().required('Location Shed is required'),
        treatmentName: Yup.string().required('Treatment Name is required'),
        volume: Yup.number().required('Volume is required').positive('Volume must be positive'),
        date: Yup.date().required('Date is required'),
    });

    // Initialize Formik
    const formik = useFormik({
        initialValues: {
            tagId: "",
            locationShed: "",
            date: "",
            treatmentName: "",
            volume: "",
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
                        <label className="label" htmlFor="tagId">Tag ID</label>
                        <input
                            autoComplete="off"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.tagId}
                            id="tagId"
                            type="text"
                            className="input2"
                            name="tagId"
                            aria-label="Tag ID"
                        />
                        {formik.errors.tagId && formik.touched.tagId && <p className="text-danger">{formik.errors.tagId}</p>}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="locationShed">Location Shed</label>
                        <input
                            autoComplete="off"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.locationShed}
                            id="locationShed"
                            type="text"
                            className="input2"
                            name="locationShed"
                            aria-label="Location Shed"
                        />
                        {formik.errors.locationShed && formik.touched.locationShed && <p className="text-danger">{formik.errors.locationShed}</p>}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="treatmentName">Treatment Name</label>
                        <input
                            autoComplete="off"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.treatmentName}
                            id="treatmentName"
                            type="text"
                            className="input2"
                            name="treatmentName"
                            aria-label="Treatment Name"
                        />
                        {formik.errors.treatmentName && formik.touched.treatmentName && <p className="text-danger">{formik.errors.treatmentName}</p>}
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
                        <label className="label" htmlFor="date">Date</label>
                        <input
                            autoComplete="off"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.date} 
                            id="date"
                            type="date"
                            className="input2"
                            name="date"
                            aria-label="Date of Treatment"
                        />
                        {formik.errors.date && formik.touched.date && <p className="text-danger">{formik.errors.date}</p>}
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditTreatAnimal;
