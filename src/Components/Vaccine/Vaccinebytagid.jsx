import React, { useContext, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { IoIosSave } from "react-icons/io";
import axios from 'axios';
import { VaccineanimalContext } from '../../Context/VaccineanimalContext';
import { useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';
import { LocationContext } from '../../Context/Locationshedcontext';
import { number } from 'yup';
import { useTranslation } from 'react-i18next';
function VaccinebytagId() {
    const { t } = useTranslation();
    const { getallVaccineanimal } = useContext(VaccineanimalContext); 
    const { getLocationtMenue,getVaccineMenue } = useContext(LocationContext); 
    const [isLoading, setIsLoading] = useState(false);
    const [locations, setLocations] = useState([]);
    const [Vaccine, setVaccine] = useState([]);
    const [isLoadingLocations, setIsLoadingLocations] = useState(true);
    const navigate = useNavigate();
  
    useEffect(() => {
        const fetchLocations = async () => {
            setIsLoadingLocations(true);
            try {
                const { data } = await getLocationtMenue();
                // console.log("API Response Data:", data);
                
                if (data.status === 'success') {
                
                    const locationsData = data.data.tagIds || data.data;
                    // console.log("Locations Data:", locationsData);
                    setLocations(Array.isArray(locationsData) ? locationsData : []);
                }
            } catch (err) {
                console.error("Error details:", err);
                Swal.fire("Error!", "Failed to load locations data", "error");
                setLocations([]);
            } finally {
                setIsLoadingLocations(false);
            }
        };
        fetchLocations();
    }, [getLocationtMenue]);

    useEffect(() => {
        const fetchVaccine = async () => {
            setIsLoadingLocations(true);
            try {
                const { data } = await getVaccineMenue();
                console.log("API Response Data:", data.data.vaccines);
                
                if (data.status === 'success') {
                
                    const Vaccine = data.data.vaccines
                     || data.data;
                    console.log("Vaccine:", Vaccine);
                    setVaccine(Array.isArray(Vaccine) ? Vaccine : []);
                }
            } catch (err) {
                console.error("Error details:", err);
                Swal.fire("Error!", "Failed to load locations data", "error");
                setVaccine([]);
            } finally {
                setIsLoadingLocations(false);
            }
        };
        fetchVaccine();
    }, [getVaccineMenue]);

    const getHeaders = () => {
        const token = localStorage.getItem('Authorization');
        if (!token) {
            navigate('/login');
            throw new Error('No authorization token found');
        }
        return {
            Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`
        };
    };

    const formik = useFormik({
        initialValues: {
            vaccineId:'',
            date:'',
            tagId:'', 
            entryType:'',
        },
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const headers = getHeaders();
                const dataToSend = {
                    vaccineId: values.vaccineId,
                    date: values.date,
                    tagId: values.tagId,
                    entryType: values.entryType,
                };
        
                console.log("🚀 Data to send:", dataToSend);
        
                const {data} = await axios.post(
                    'https://farm-project-bbzj.onrender.com/api/vaccine/AddVaccineForAnimal',
                    dataToSend,
                    { headers }
                );
        
                console.log("✅ API Response:", data);
        
                if (data.status === "SUCCESS") {

                    Swal.fire({
                        title: "Success!",
                        text: "Data has been submitted successfully!",
                        icon: "success",
                        confirmButtonText: "OK",
                        
                    }).then(() => navigate('/Vaccinebyanimalsstable'));
                }
            } catch (err) {
                console.error("❌ API Error:", err.response?.data);
                Swal.fire({
                    title: "Error!",
                    text: err.response?.data?.message || "An error occurred while submitting data.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            } finally {
                setIsLoading(false);
            }
        }
        
    });

    return (
        <div className="container">
            <form onSubmit={formik.handleSubmit} className="mt-5">
                <div className='d-flex vaccine align-items-center justify-content-between'>
                    <div className="title-v"> {t('Add Vaccine by Tag Id')}</div>
                    <button type="submit" className="btn button2" disabled={isLoading}>
                        {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <IoIosSave />}  {t('Save')}
                    </button>
                </div>

                <div className="animaldata">
                <div className="input-box">
                        <label className="label" htmlFor="tagId"> {t('Vaccine Name')}</label>
                        <select
                            id="vaccineId"
                            name="vaccineId"
                            className="input2"
                            onChange={formik.handleChange}
                            value={formik.values.vaccineId}
                            required
                            type="number"
                        >
                            <option value=""> {t('Select Vaccine Name')}</option>
                            {isLoadingLocations ? (
                                <option disabled> {t('Loading locations...')}</option>
                            ) : (
                                Vaccine.map((Vaccine) => (
                                    <option key={Vaccine._id} value={Vaccine._id}>
                                        {Vaccine.vaccineName}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="date"> {t('Date')}</label>
                        <input
                            id="date"
                            name="date"
                            type="date"
                            className="input2"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.date}
                            required
                        />
                    </div>

                    <div className="input-box">
    <label className="label" htmlFor="entryType"> {t('Entry Type')}</label>
    <select
        id="entryType"
        name="entryType"
        className="input2"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.entryType}
    >
        <option value=""> {t('Select Entry Type')}</option>
        <option value="Booster Dose"> {t('Booster Dose')}</option>
        <option value="Annual Dose"> {t('Annual Dose')}</option>
        <option value="First Dose"> {t('First Dose')}</option>
    </select>
</div>
                    <div className="input-box">
                        <label className="label" htmlFor="tagId"> {t('Tag Id')}</label>
                        <input
                            id="tagId"
                            name="tagId"
                            type="text"
                            className="input2"
                            placeholder= {t('Enter Tag Id')}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.tagId}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default VaccinebytagId;