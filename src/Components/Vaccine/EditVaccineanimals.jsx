import { useFormik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { IoIosSave } from "react-icons/io";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { LocationContext } from '../../Context/Locationshedcontext';
import { useTranslation } from 'react-i18next';

function EditVaccine() {
    const { t } = useTranslation();
    const { getVaccineMenue } = useContext(LocationContext); 
    const [vaccines, setVaccines] = useState([]);
    const [isLoadingVaccines, setIsLoadingVaccines] = useState(true);
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

    useEffect(() => {
        const fetchVaccines = async () => {
            setIsLoadingVaccines(true);
            try {
                const { data } = await getVaccineMenue();
                if (data.status === 'success') {
                    setVaccines(data.data.vaccines || []);
                }
            } catch (err) {
                console.error("Error fetching vaccines:", err);
                setVaccines([]);
            } finally {
                setIsLoadingVaccines(false);
            }
        };
        fetchVaccines();
    }, [getVaccineMenue]);

    async function editVaccine(values) {
        setIsLoading(true);
        try {
            const response = await axios.patch(
                `https://farm-project-bbzj.onrender.com/api/vaccine/updateVaccineEntry/${id}`,
                {
                    tagId: values.tagId,
                    date: values.date,
                    entryType: values.entryType,
                    vaccineId: values.vaccineId
                },
                { headers: getHeaders() }
            );
            
            if (response.data.status === "success") {
                Swal.fire({
                    title: t('success'),
                    text: t('vaccine_updated_successfully'),
                    icon: 'success',
                    confirmButtonColor: '#88522e'
                });
                navigate('/vaccineTable');
            }
        } catch (err) {
            console.error('Error details:', err.response?.data);
            setError(err.response?.data?.message || t('error_updating_vaccine'));
            Swal.fire({
                title: t('error'),
                text: err.response?.data?.message || t('error_updating_vaccine'),
                icon: 'error',
                confirmButtonColor: '#88522e'
            });
        } finally {
            setIsLoading(false);
        }
    }

    const formik = useFormik({  
        initialValues: {
            tagId: '',
            date: '',
            entryType: '',
            vaccineId: ''
        },
        onSubmit: editVaccine,
    });

    useEffect(() => {
        async function fetchVaccineEntry() {
            try {
                const response = await axios.get(
                    `https://farm-project-bbzj.onrender.com/api/vaccine/getSingleVaccineEntry/${id}`,
                    { headers: getHeaders() }
                );
                
                const vaccineEntry = response.data.data.vaccineEntry;
                const formattedDate = vaccineEntry.date 
                    ? new Date(vaccineEntry.date).toISOString().split('T')[0]
                    : '';
                
                const vaccineId = vaccineEntry.vaccineId || 
                                 (vaccineEntry.vaccine ? vaccineEntry.vaccine._id : '');
                
                formik.setValues({
                    tagId: vaccineEntry.tagId || '',
                    vaccineId: vaccineId,
                    date: formattedDate,
                    entryType: vaccineEntry.entryType || ''
                });
            } catch (error) {
                console.error("Error fetching vaccine entry:", error.response?.data);
                setError(t("error_fetching_vaccine_details"));
            }
        }
        fetchVaccineEntry();
    }, [id]);

    return (
        <div className="container">
            <div className="animaldata">
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={formik.handleSubmit}>

                         <div className='d-flex vaccine align-items-center justify-content-between'>
                                            <h2 className="title-v">Edit Vaccine</h2>
                                            <button type="submit" className="btn button2" disabled={isLoading}>
                                                {isLoading ? <span className="btn button2"></span> : <><IoIosSave /> Save</>}
                                            </button>
                                        </div>

                        <div className='d-flex vaccine align-items-center justify-content-between'>
                            <h2 className="title-v">{t("Edit Vaccine")}</h2>
                                <button type="submit" className="btn button2">
                                                  <IoIosSave /> {t("save")}
                                              </button>
                        </div>

                        <div className="row g-3">
                            <div className="mb-3 input-box">
                                <label htmlFor="tagId" className="form-label fw-bold">{t("animal_tag_id")}</label>
                                <input
                                    id="tagId"
                                    name="tagId"
                                    type="text"
                                    className="form-control"
                                    placeholder={t("enter_animal_tag_id")}
                                    value={formik.values.tagId}
                                    onChange={formik.handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3 input-box">
                                <label htmlFor="date" className="form-label fw-bold">{t("vaccination_date")}</label>
                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    className="form-control"
                                    value={formik.values.date}
                                    onChange={formik.handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3 input-box">
                                <label htmlFor="vaccineId" className="form-label fw-bold">{t("vaccine")}</label>
                                <select
                                    id="vaccineId"
                                    name="vaccineId"
                                    className="form-select"
                                    value={formik.values.vaccineId}
                                    onChange={formik.handleChange}
                                    required
                                    disabled={isLoadingVaccines}
                                >
                                    <option value="">{t("select_vaccine")}</option>
                                    {isLoadingVaccines ? (
                                        <option disabled>{t("loading_vaccines")}</option>
                                    ) : (
                                        vaccines.map((vaccine) => (
                                            <option key={vaccine._id} value={vaccine._id}>
                                                {vaccine.vaccineName}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div className="mb-3 input-box">
                                <label htmlFor="entryType" className="form-label fw-bold">{t("entry_type")}</label>
                                <select
                                    id="entryType"
                                    name="entryType"
                                    className="form-select"
                                    value={formik.values.entryType}
                                    onChange={formik.handleChange}
                                    required
                                >
                                    <option value="">{t("select_entry_type")}</option>
                                    <option value="Booster Dose">{t("booster_dose")}</option>
                                    <option value="Annual Dose">{t("annual_dose")}</option>
                                    <option value="Initial Dose">{t("initial_dose")}</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditVaccine;
