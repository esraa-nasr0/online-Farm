import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { IoIosSave } from "react-icons/io";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function EditVaccine() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    // Helper function to generate headers with the latest token
    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        return {
            Authorization: Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`
        };
    };

    async function editVaccine(values) {
        setIsLoading(true);
        try {
            const { data } = await axios.patch(
                `https://farm-project-bbzj.onrender.com/api/vaccine/UpdateVaccine/${id}`,
                values,
                { headers: getHeaders() }
            );
            console.log('Submitting form with values:', values);
            if (data.status === "success") {
                Swal.fire('Success', 'Vaccine updated successfully', 'success');
                navigate('/vaccines');
            }
        } catch (err) {
            setError(err.response?.data?.message || "حدث خطأ أثناء معالجة طلبك");
            console.error(err.response?.data);
        } finally {
            setIsLoading(false);
        }
    }

    const formik = useFormik({  
        initialValues: {
            vaccineName: '',
            givenEvery: '',
            tagId: '',
            DateGiven: '',
        },
        onSubmit: editVaccine,
    });

    useEffect(() => {
        async function fetchVaccine() {
            try {
                const response = await axios.get(
                    `https://farm-project-bbzj.onrender.com/api/vaccine/GetSingleVaccine/${id}`,
                    { headers: getHeaders() }
                );
                const vaccine = response.data.data;
                formik.setValues({
                    tagId: vaccine?.tagId || '',
                    vaccineName: vaccine?.vaccineName || '',
                    givenEvery: vaccine?.givenEvery || '',
                    DateGiven: vaccine?.DateGiven || '',
                });
            } catch (error) {
                console.error("Failed to fetch vaccine data:", error);
                setError("Failed to fetch vaccine details.");
            }
        }
        fetchVaccine();
    }, [id, formik]);

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
                            {...formik.getFieldProps('vaccineName')}
                        />
                    </div>
                    <div className="input-box">
                        <label className="label" htmlFor="givenEvery">Given Every</label>
                        <input
                            id="givenEvery"
                            name="givenEvery"
                            type="text"
                            className="input2"
                            placeholder="Enter givenEvery"
                            {...formik.getFieldProps('givenEvery')}
                        />
                    </div>
                    <div className="input-box">
                        <label className="label" htmlFor="tagId">Tag ID</label>
                        <input
                            id="tagId"
                            name="tagId"
                            type="text"
                            className="input2"
                            placeholder="Enter tag ID"
                            {...formik.getFieldProps('tagId')}
                        />
                    </div>
                    <div className="input-box">
                        <label className="label" htmlFor="DateGiven">Date Given</label>
                        <input
                            id="DateGiven"
                            name="DateGiven"
                            type="date"
                            className="input2"
                            {...formik.getFieldProps('DateGiven')}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditVaccine;
