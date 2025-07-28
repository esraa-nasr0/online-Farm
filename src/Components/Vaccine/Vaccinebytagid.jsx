import React, { useContext, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { IoIosSave } from "react-icons/io";
import axios from 'axios';
import { VaccineanimalContext } from '../../Context/VaccineanimalContext';
import { useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

function VaccinebytagId() {
    const { t, i18n } = useTranslation();
    const { getallVaccineanimal, getVaccineMenue } = useContext(VaccineanimalContext); 
    const [isLoading, setIsLoading] = useState(false);
    const [Vaccine, setVaccine] = useState([]);
    const [isLoadingVaccines, setIsLoadingVaccines] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVaccine = async () => {
            setIsLoadingVaccines(true);
            try {
                const { data } = await getVaccineMenue();
                
                if (data.status === 'success') {
                    const vaccines = data.data.vaccines || data.data;
                    setVaccine(Array.isArray(vaccines) ? vaccines : []);
                }
            } catch (err) {
                console.error("Error details:", err);
                setError(t("failedLoadVaccines"));
                setVaccine([]);
            } finally {
                setIsLoadingVaccines(false);
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
            tagId: '', 
            entryType: '',
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
        
                const {data} = await axios.post(
                    'https://farm-project-bbzj.onrender.com/api/vaccine/AddVaccineForAnimal',
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
        <div className="animal-details-container">
            <div className="animal-details-header">
                <h1>{t('addVaccineByTagId')}</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={formik.handleSubmit} className="animal-form">
                <div className="form-grid">
                    <div className="form-section">
                        <h2>{t('vaccineInformation')}</h2>
                        
                        <div className="input-group">
                            <label htmlFor="vaccineId">{t('vaccineName')}</label>
                            <select
                                id="vaccineId"
                                name="vaccineId"
                                onChange={formik.handleChange}
                                value={formik.values.vaccineId}
                                required
                            >
                                <option value="">{t('selectVaccineName')}</option>
                                {isLoadingVaccines ? (
                                    <option disabled>{t('loading')}...</option>
                                ) : (
                                    Vaccine.map((item) => (
                                        <option key={item._id} value={item._id}>
                                            {i18n.language === "ar" ? item.vaccineType?.arabicName : item.vaccineType?.englishName}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>

                        <div className="input-group">
                            <label htmlFor="date">{t('date')}</label>
                            <input
                                id="date"
                                name="date"
                                type="date"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.date}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>{t('animalInformation')}</h2>
                        
                        <div className="input-group">
                            <label htmlFor="tagId">{t('tagId')}</label>
                            <input
                                id="tagId"
                                name="tagId"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.tagId}
                                placeholder={t('enterTagId')}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="entryType">{t('entryType')}</label>
                            <select
                                id="entryType"
                                name="entryType"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.entryType}
                                required
                            >
                                <option value="">{t('selectEntryType')}</option>
                                <option value="Booster Dose">{t('boosterDose')}</option>
                                <option value="Annual Dose">{t('annualDose')}</option>
                                <option value="First Dose">{t('firstDose')}</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="save-button"
                        disabled={isLoading || isLoadingVaccines}
                    >
                        {isLoading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            <>
                                <IoIosSave /> {t('save')}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default VaccinebytagId;