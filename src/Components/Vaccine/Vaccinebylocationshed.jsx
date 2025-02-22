import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import { IoIosSave } from "react-icons/io";
import axios from 'axios';
import { VaccineanimalContext } from '../../Context/VaccineanimalContext';
import { useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';

function Vaccinebylocationshed() {
    const { getallVaccineanimal } = useContext(VaccineanimalContext); 
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()
    
// Helper function to generate headers with the latest token
const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
    // Ensure the token has only one "Bearer" prefix
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
    return {
        Authorization: formattedToken
    };
};

    const formik = useFormik({
        initialValues: {
            vaccineName: '',
            givenEvery: '',
            locationShed: '', 
            DateGiven: '',
        },
        onSubmit: async (values) => {
            const headers = getHeaders(); // Get the latest headers
            const isVaccineExists = async (vaccineName) => {
                const response = await getallVaccineanimal();
                return response.data.vaccine.some(vaccine => vaccine.vaccineName === vaccineName);
            };
            const dataToSend = {
                vaccineName: values.vaccineName,
                givenEvery: values.givenEvery,  
                vaccinationLog: [
                    {
                        locationShed: values.locationShed,
                        DateGiven: values.DateGiven,
                    },
                ],
            };
            setIsLoading(true); 
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
        <div className="container">
            <form onSubmit={formik.handleSubmit} className="mt-5">
                <div className='d-flex vaccine align-items-center justify-content-between'>
                    <div className="title-v">Add Vaccine by Location Shed</div>
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
                       
                        <input
                            id="givenEvery"
                            name="givenEvery"
                            type="text"
                            className="input2"
                            placeholder="Enter vaccine name"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.givenEvery}
                        />
                    
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="locationShed">Location Shed</label>
                        <input
                            id="locationShed"
                            name="locationShed"
                            type="text"
                            className="input2"
                            placeholder="Enter location shed"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.locationShed}
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

export default Vaccinebylocationshed;
