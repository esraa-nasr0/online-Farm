import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import { IoIosSave } from "react-icons/io";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

function Vaccinebyanimal() {

// Helper function to generate headers with the latest token
const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
    // Ensure the token has only one "Bearer" prefix
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
    return {
        Authorization: formattedToken
    };
};
    let navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            vaccineName: '',
            givenEvery: '',
            tagId: '',
            DateGiven: '',
        },
        onSubmit: async (values) => {
            const headers = getHeaders(); // Get the latest headers
            setIsLoading(true);  // Start loading
            const dataToSend = {
                vaccineName: values.vaccineName,
                givenEvery: values.givenEvery,
                vaccinationLog: [
                    {
                        tagId: values.tagId,
                        DateGiven: values.DateGiven,
                    },
                ],
            };
            try {
                const response = await axios.post(
                    'https://farm-project-bbzj.onrender.com/api/vaccine/AddVaccineForAnimal',
                    dataToSend,
                    {
                        headers
                    }
                );
            if (response.data.status === "success") {
                Swal.fire({
                title: "Success!",
                text: "Data has been submitted successfully!",
                icon: "success",
                confirmButtonText: "OK",
                }).then(() => navigate('/vaccineTable'));
                    console.log('API Response:', response.data);
                        
                            }}
                        catch (err) {
                        Swal.fire({
                        title: "Error!",
                        text: err.response?.data?.message || "An error occurred while submitting data.",
                        icon: "error",
                        confirmButtonText: "OK",
                        });
                        } finally {
                        setIsLoading(false);
                        }
        },
    });

    return (
        <>
            <div className="container">
            <div className="title2">Add Vaccine </div>
                <p className="text-danger">{error}</p>
                <form onSubmit={formik.handleSubmit} className="mt-5">
                {isLoading ? (
                        <button type="submit" className="btn button2" disabled>
                            <i className="fas fa-spinner fa-spin"></i>
                        </button>
                    ) : (
                        <button type="submit" className="btn button2">
                            <IoIosSave />  Save
                        </button>
                    )}
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
                            <input
                                id="givenEvery"
                                name="givenEvery"
                                type="text"
                                className="input2"
                                placeholder="Given Every"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.givenEvery}
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
        </>
    );
}

export default Vaccinebyanimal;
