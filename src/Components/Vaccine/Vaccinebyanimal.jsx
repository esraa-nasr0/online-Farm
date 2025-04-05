import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import { IoIosSave } from "react-icons/io";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

function Vaccinebyanimal() {


const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
  
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
            BoosterDose: '',
            AnnualDose: '',
            bottles: '',
            dosesPerBottle: '',
            bottlePrice: '',
        },
        onSubmit: async (values) => {
            const headers = getHeaders(); 
            setIsLoading(true);  
            const dataToSend = {
                vaccineName: values.vaccineName,
                BoosterDose: values.BoosterDose,
                AnnualDose: values.AnnualDose,
                bottles: values.bottles,
                dosesPerBottle: values.dosesPerBottle,
                bottlePrice: values.bottlePrice,
               
            };
            try {
               
                const response = await axios.post(
                    'https://farm-project-bbzj.onrender.com/api/vaccine/AddVaccine',
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
                            <label className="label" htmlFor="BoosterDose">Booster Dose</label>
                            <input
                                id="BoosterDose"
                                name="BoosterDose"
                                type="text"
                                className="input2"
                                placeholder="Given Every"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.BoosterDose}
                            />
                        </div>

                        <div className="input-box">
                            <label className="label" htmlFor="locationShed">Annual Dose</label>
                            <input
                                id="AnnualDose"
                                name="AnnualDose"
                                type="text"
                                className="input2"
                                placeholder="Enter tag ID"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.AnnualDose}
                            />
                        </div>

                        <div className="input-box">
                            <label className="label" htmlFor="bottles">bottles</label>
                            <input
                                id="bottles"
                                name="bottles"
                             type="text"
                                className="input2"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.bottles}
                            />
                        </div>

                        
                        <div className="input-box">
                            <label className="label" htmlFor="dosesPerBottle">doses Per Bottle</label>
                            <input
                                id="dosesPerBottle"
                                name="dosesPerBottle"
                             type="text"
                                className="input2"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.dosesPerBottle}
                            />
                        </div>

                        
                        <div className="input-box">
                            <label className="label" htmlFor="bottlePrice">bottle Price</label>
                            <input
                                id="bottlePrice"
                                name="bottlePrice"
                             type="text"
                                className="input2"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.bottlePrice}
                            />
                        </div>
                        
                       
                    </div>
                </form>
            </div>
        </>
    );
}

export default Vaccinebyanimal;
