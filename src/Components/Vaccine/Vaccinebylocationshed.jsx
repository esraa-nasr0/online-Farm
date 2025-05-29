import React, { useContext, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { IoIosSave } from "react-icons/io";
import axios from 'axios';
import { VaccineanimalContext } from '../../Context/VaccineanimalContext';
import { useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';
import { LocationContext } from '../../Context/Locationshedcontext';
import { useTranslation } from 'react-i18next';

function Vaccinebylocationshed() {
    const { getallVaccineanimal } = useContext(VaccineanimalContext); 
    const { getLocationtMenue, getVaccineMenue } = useContext(LocationContext); 
    const [isLoading, setIsLoading] = useState(false);
    const [locations, setLocations] = useState([]);
    const [Vaccine, setVaccine] = useState([]);
    const [isLoadingLocations, setIsLoadingLocations] = useState(true);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchLocations = async () => {
            setIsLoadingLocations(true);
            try {
                const { data } = await getLocationtMenue();
                if (data.status === 'success') {
                    const locationsData = data.data.locationSheds || data.data;
                    setLocations(Array.isArray(locationsData) ? locationsData : []);
                }
            } catch (err) {
                console.error("Error details:", err);
                Swal.fire(t("error"), t("failedLoadLocations"), "error");
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
                if (data.status === 'success') {
                    const vaccineData = data.data.vaccines || data.data;
                    setVaccine(Array.isArray(vaccineData) ? vaccineData : []);
                }
            } catch (err) {
                console.error("Error details:", err);
                Swal.fire(t("error"), t("failedLoadVaccines"), "error");
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
            vaccineId: '',
            date: '',
            locationShed: '', 
            entryType: '',
        },
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const headers = getHeaders();
                const dataToSend = {
                    vaccineId: values.vaccineId,
                    date: values.date,
                    locationShed: values.locationShed,
                    entryType: values.entryType,
                };

                const { data } = await axios.post(
                    'https://farm-project-bbzj.onrender.com/api/vaccine/AddVaccineForAnimals',
                    dataToSend,
                    { headers }
                );

                if (data.status === "SUCCESS") {
                    Swal.fire({
                        title: t("success"),
                        text: t("dataSubmittedSuccessfully"),
                        icon: "success",
                        confirmButtonText: t("ok"),
                    }).then(() => navigate('/Vaccinebyanimalsstable'));
                }
            } catch (err) {
                Swal.fire({
                    title: t("error"),
                    text: err.response?.data?.message || t("submitError"),
                    icon: "error",
                    confirmButtonText: t("ok"),
                });
            } finally {
                setIsLoading(false);
            }
        }
    });

    return (
        <div className=' container mx-auto'>

            <div 
             className="big-card"   style={{
                width: '100%',
                // padding: '20px',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            
              }}
            >
            <div className="container">
            <div className="title2" style={{paddingTop:"15px"}}>{t("addByLocationTitle")}</div>
            <form onSubmit={formik.handleSubmit} className="mt-5">
                {isLoading ? (
                    <button type="submit" className="btn button2" disabled>
                        <i className="fas fa-spinner fa-spin"></i>
                    </button>
                ) : (
                    <button type="submit" className="btn button2">
                        <IoIosSave /> {t("save")}
                    </button>
                )}
                <div className="animaldata">

                    <div className="input-box">
                        <label className="label" htmlFor="vaccineId">{t("vaccineName")}</label>
                        <select
                            id="vaccineId"
                            name="vaccineId"
                            className="input2"
                            onChange={formik.handleChange}
                            value={formik.values.vaccineId}
                            required
                        >
                            <option value="">{t("selectVaccine")}</option>
                            {isLoadingLocations ? (
                                <option disabled>{t("loadingVaccines")}...</option>
                            ) : (
                                Vaccine.map((v) => (
                                    <option key={v._id} value={v._id}>
                                        {v.vaccineName}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="date">{t("date")}</label>
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
                        <label className="label" htmlFor="locationShed">{t("Location Shed")}</label>
                        <select
                            id="locationShed"
                            name="locationShed"
                            className="input2"
                            onChange={formik.handleChange}
                            value={formik.values.locationShed}
                            required
                        >
                            <option value="">{t("selectLocationShed")}</option>
                            {isLoadingLocations ? (
                                <option disabled>{t("loadingLocations")}...</option>
                            ) : (
                                locations.map((location) => (
                                    <option key={location._id} value={location._id}>
                                        {location.locationShedName}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="entryType">{t("Entry Type")}</label>
                        <select
                            id="entryType"
                            name="entryType"
                            className="input2"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.entryType}
                        >
                            <option value="">{t("selectEntryType")}</option>
                            <option value="Booster Dose">{t("boosterDose")}</option>
                            <option value="Annual Dose">{t("annualDose")}</option>
                            <option value="First Dose">{t("firstDose")}</option>
                        </select>
                    </div>

                </div>
            </form>
        </div>
            </div>
        </div>
  
    );
}

export default Vaccinebylocationshed;
