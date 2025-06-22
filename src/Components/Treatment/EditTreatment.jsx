import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { IoIosSave } from "react-icons/io";
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Treatment.css';


function EditTreatment() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return { Authorization: formattedToken };
    };

    async function submitTreatment(values) {
        const headers = getHeaders();
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await axios.patch(
                `https://farm-project-bbzj.onrender.com/api/treatment/updatetreatment/${id}`,
                values,
                { headers }
            );
            if (data.status === "success") {
                Swal.fire({
                    title: t('successTitle'),
                    text: t('treatmentUpdated'),
                    icon: 'success',
                    confirmButtonText: t('ok'),
                });
                navigate('/treatmentTable');
            }
        } catch (err) {
            setError(err.response?.data?.message || t('errorOccurred'));
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        async function fetchTreatment() {
            const headers = getHeaders();
            setError(null);
            try {
                const { data } = await axios.get(
                    `https://farm-project-bbzj.onrender.com/api/treatment/getsingletreatment/${id}`,
                    { headers }
                );
                if (data?.data?.treatment) {
                    const treatment = data.data.treatment;
                    formik.setValues({
                        name: treatment.name || '',
                        type: treatment.type || '',
                        volume: treatment.volume || '',
                        price: treatment.price || '',
                    });
                } else {
                    throw new Error("Unexpected API response structure");
                }
            } catch (error) {
                setError(t('fetchError'));
            }
        }
        fetchTreatment();
    }, [id]);

    const validationSchema = Yup.object({
        name: Yup.string().required(t('nameRequired')),
        type: Yup.string().required(t('typeRequired')),
        volume: Yup.number().required(t('volumeRequired')).positive(t('volumePositive')),
        price: Yup.number().required(t('priceRequired')).positive(t('pricePositive')),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            type: "",
            volume: "",
            price: "",
        },
        validationSchema,
        onSubmit: submitTreatment,
    });

    return (
        <div className="treatment-container">
            <div className="treatment-header">
                <h1>{t('editTreatment')}</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={formik.handleSubmit} className="treatment-form">
                <div className="form-grid">
                    <div className="form-section">
                        <h2>{t('treatment_details')}</h2>
                        <div className="input-group">
                            <label htmlFor="name">{t('name')}</label>
                            <input
                                id="name"
                                type="text"
                                {...formik.getFieldProps('name')}
                                placeholder={t('enter_treatment_name')}
                            />
                            {formik.errors.name && formik.touched.name && (
                                <p className="error-message">{formik.errors.name}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="type">{t('type')}</label>
                            <input
                                id="type"
                                type="text"
                                {...formik.getFieldProps('type')}
                                placeholder={t('enter_treatment_type')}
                            />
                            {formik.errors.type && formik.touched.type && (
                                <p className="error-message">{formik.errors.type}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="volume">{t('volume')}</label>
                            <input
                                id="volume"
                                type="number"
                                {...formik.getFieldProps('volume')}
                                placeholder={t('enter_treatment_volume')}
                            />
                            {formik.errors.volume && formik.touched.volume && (
                                <p className="error-message">{formik.errors.volume}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="price">{t('price')}</label>
                            <input
                                id="price"
                                type="number"
                                {...formik.getFieldProps('price')}
                                placeholder={t('enter_treatment_price')}
                            />
                            {formik.errors.price && formik.touched.price && (
                                <p className="error-message">{formik.errors.price}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    {isLoading ? (
                        <button type="submit" className="save-button" disabled>
                            <span className="loading-spinner"></span>
                        </button>
                    ) : (
                        <button type="submit" className="save-button">
                            <IoIosSave /> {t('save')}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default EditTreatment;
