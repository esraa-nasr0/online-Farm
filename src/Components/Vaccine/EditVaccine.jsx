import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { IoIosSave } from "react-icons/io";
import axios from 'axios';
import { useParams } from 'react-router-dom';

function EditVaccine() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();

    const Authorization = localStorage.getItem('Authorization');
    const headers = {
        Authorization: `Bearer ${Authorization}`,  // Fixed Authorization header
    };

    async function editVaccine(values) {
        setIsLoading(true);
        try {
            const updatedValues = {
                ...values,
            };

            const { data } = await axios.patch(
                `https://farm-project-bbzj.onrender.com/api/vaccine/UpdateVaccine/${id}`,  // Fixed URL string
                updatedValues,
                { headers }
            );
            console.log('Submitting form with values:', updatedValues);

            if (data.status === "success") {
                setIsLoading(false);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "حدث خطأ أثناء معالجة طلبك";  // Error fallback message
            setError(errorMessage);
            console.log(err.response?.data);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        async function fetchVaccine() {
            try {
                const { data } = await axios.get(
                    `https://farm-project-bbzj.onrender.com/api/vaccine/GetSingleVaccine/${id}`,  // Fixed URL string
                    { headers }
                );
                console.log("API response:", data);
    
                if (data && data.data && data.data.vaccine) {
                    const vaccine = data.data.vaccine;
                    
                    const vaccinationLog = vaccine.vaccinationLog && vaccine.vaccinationLog.length > 0 
                        ? vaccine.vaccinationLog[0] 
                        : {};
    
                    formik.setValues({
                        vaccineName: vaccine.vaccineName || '',
                        givenEvery: vaccine.givenEvery || '',
                        tagId: vaccinationLog.tagId || '',
                        DateGiven: vaccinationLog.DateGiven 
                            ? new Date(vaccinationLog.DateGiven).toISOString().split('T')[0] 
                            : '',
                    });
                } else {
                    throw new Error("Unexpected API response structure");
                }
            } catch (error) {
                console.error("فشل في جلب بيانات اللقاح:", error);
                setError("فشل في جلب تفاصيل اللقاح.");
            }
        }
        fetchVaccine();
    }, [id]);

    const formik = useFormik({  
        initialValues: {
            vaccineName: '',
            givenEvery: '',
            tagId: '',
            DateGiven: '',
        },
        onSubmit: (values) => editVaccine(values),
    });

    return (
        <div className="container">
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={formik.handleSubmit} className="mt-5">
                <div className='d-flex vaccine align-items-center justify-content-between'>
                    <div className="title-v">Edit Vaccine</div>
                    <button type="submit" className="btn button2" disabled={isLoading}>
                        {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <IoIosSave />} Save
                    </button>
                </div>
        
                <div className="animaldata">
                    <div className="input-box">
                        <label className="label" htmlFor="vaccineName">Vaccine Name</label>
                        <input
                            id="vaccineName"
                            name="vaccineName"
                            type="text"
                            className="input2"
                            placeholder="Enter vaccine name"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.vaccineName}
                        />
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="givenEvery">Given Every</label>
                        <select
                            id="givenEvery"
                            name="givenEvery"
                            className="input2"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.givenEvery}
                        >
                            <option value="">Select interval</option>
                            <option value="90">3 months (90 days)</option>
                            <option value="180">6 months (180 days)</option>
                            <option value="365">12 months (365 days)</option>
                        </select>
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="tagId">Tag ID</label>
                        <input
                            id="tagId"
                            name="tagId"
                            type="text"
                            className="input2"
                            placeholder="Enter tag ID"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.tagId}
                        />
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="DateGiven">Date Given</label>
                        <input
                            id="DateGiven"
                            name="DateGiven"
                            type="date"
                            className="input2"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.DateGiven}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditVaccine;
