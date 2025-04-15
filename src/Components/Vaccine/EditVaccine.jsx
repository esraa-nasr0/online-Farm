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

    const getHeaders = () => {
        const token = localStorage.getItem('Authorization');
        return {
            'Authorization': token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    async function editVaccine(values) {
        setIsLoading(true);
        try {
            console.log('Submitting form with values:', values);
            
            const response = await axios.patch(
                `https://farm-project-bbzj.onrender.com/api/vaccine/UpdateVaccine/${id}`,
                {
                    vaccineName: values.vaccineName,
                    BoosterDose: values.BoosterDose,
                    AnnualDose: values.AnnualDose,
                    stock: {
                        bottles: values.bottles,
                        dosesPerBottle: values.dosesPerBottle
                    },
                    pricing: {
                        bottlePrice: values.bottlePrice
                    }
                },
                { headers: getHeaders() }
            );
            
            console.log('Vaccine data:', response.data.data);
            
            if (response.data.status === "success") {
                Swal.fire('Success', 'Vaccine updated successfully', 'success');
                navigate('/vaccineTable');
            }
        } catch (err) {
            console.error('Error details:', err.response?.data);
            setError(err.response?.data?.message || "An error occurred while processing your request");
        } finally {
            setIsLoading(false);
        }
    }

    const formik = useFormik({  
        initialValues: {
            vaccineName: '',
            BoosterDose: '',
            AnnualDose: '',
            bottles: '',
            dosesPerBottle: '',
            bottlePrice: '',
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
                console.log('Vaccine object:', vaccine);
                
                formik.setValues({
                    vaccineName: vaccine?.vaccine.vaccineName || '',
                    BoosterDose: vaccine?.vaccine.BoosterDose || '',
                    AnnualDose: vaccine?.vaccine.AnnualDose || '',
                    bottles: vaccine?.vaccine.stock?.bottles?.toString() || '',
                    dosesPerBottle: vaccine?.vaccine.stock?.dosesPerBottle?.toString() || '',
                    bottlePrice: vaccine?.vaccine.pricing?.bottlePrice?.toString() || '',
                });
            } catch (error) {
                console.error("Error fetching vaccine:", error.response?.data);
                setError("Failed to fetch vaccine details.");
            }
        }
        fetchVaccine();
    }, [id]);

    return (
        <div className="container">
            <div className='d-flex vaccine align-items-center justify-content-between'>
                <h2 className="title-v">Edit Vaccine</h2>
                <button 
                    type="submit" 
                    className="btn button2" 
                    disabled={isLoading}
                    onClick={formik.handleSubmit}
                >
                    {isLoading ? (
                        <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                        <>
                            <IoIosSave /> Save
                        </>
                    )}
                </button>
            </div>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={formik.handleSubmit} className="mt-5">
                <div className="animaldata">
                    <div className="mb-3 input-box">
                        <label htmlFor="vaccineName" className="label">Vaccine Name</label>
                        <input
                            id="vaccineName"
                            name="vaccineName"
                            type="text"
                            className="form-control"
                            placeholder="Enter vaccine name"
                            value={formik.values.vaccineName}
                            onChange={formik.handleChange}
                        />
                    </div>
                    
                    <div className="mb-3 input-box">
                        <label htmlFor="BoosterDose" className="label">Booster Dose (days)</label>
                        <input
                            id="BoosterDose"
                            name="BoosterDose"
                            type="number"
                            className="form-control"
                            placeholder="Enter booster dose interval"
                            value={formik.values.BoosterDose}
                            onChange={formik.handleChange}
                        />
                    </div>
                    
                    <div className="mb-3 input-box">
                        <label htmlFor="AnnualDose" className="label">Annual Dose (days)</label>
                        <input
                            id="AnnualDose"
                            name="AnnualDose"
                            type="number"
                            className="form-control"
                            placeholder="Enter annual dose interval"
                            value={formik.values.AnnualDose}
                            onChange={formik.handleChange}
                        />
                    </div>
                    
                    <div className="mb-3 input-box">
                        <label htmlFor="bottles" className="label">Number of Bottles</label>
                        <input
                            id="bottles"
                            name="bottles"
                            type="number"
                            className="form-control"
                            placeholder="Enter number of bottles"
                            value={formik.values.bottles}
                            onChange={formik.handleChange}
                        />
                    </div>
                    
                    <div className="mb-3 input-box">
                        <label htmlFor="dosesPerBottle" className="label">Doses per Bottle</label>
                        <input
                            id="dosesPerBottle"
                            name="dosesPerBottle"
                            type="number"
                            className="form-control"
                            placeholder="Enter doses per bottle"
                            value={formik.values.dosesPerBottle}
                            onChange={formik.handleChange}
                        />
                    </div>
                    
                    <div className="mb-3 input-box">
                        <label htmlFor="bottlePrice" className="label">Bottle Price</label>
                        <input
                            id="bottlePrice"
                            name="bottlePrice"
                            type="number"
                            className="form-control"
                            placeholder="Enter price per bottle"
                            value={formik.values.bottlePrice}
                            onChange={formik.handleChange}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditVaccine;