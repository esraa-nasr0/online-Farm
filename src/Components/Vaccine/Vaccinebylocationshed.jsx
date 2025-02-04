import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import { IoIosSave } from "react-icons/io";
import axios from 'axios';
import { UserContext } from "../../Context/UserContext";
import { VaccineanimalContext } from '../../Context/VaccineanimalContext';
import { useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';

function Vaccinebylocationshed() {
    const { Authorization } = useContext(UserContext);
    const { getallVaccineanimal } = useContext(VaccineanimalContext); 
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            vaccineName: '',
            givenEvery: '',
            locationShed: '', 
            DateGiven: '',
        },
        onSubmit: async (values) => {
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
                        headers: {
                            Authorization: `Bearer ${Authorization}`,
                        },
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
