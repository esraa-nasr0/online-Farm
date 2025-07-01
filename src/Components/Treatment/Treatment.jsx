import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { IoIosSave } from "react-icons/io";
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import './Treatment.css';

function Treatment() {
    const { t } = useTranslation();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [treatmentData, setTreatmentData] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return { Authorization: formattedToken };
    };

    async function submitTreatment(values) {
        if (isSubmitted) return;

        const headers = getHeaders();
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await axios.post(
                `https://farm-project-bbzj.onrender.com/api/treatment/addtreatment`,
                values,
                { headers }
            );

            if (data.status === "success") {
                setIsLoading(false);
                setIsSubmitted(true);
                setTreatmentData(data.data.treatment);
                formik.resetForm();
                
                Swal.fire({
                    title: t('success'),
                    text: t('treatment_success_message'),
                    icon: 'success',
                    confirmButtonText: t('ok'),
                });
            }
        } catch (err) {
            setIsLoading(false);
            setError(err.response?.data?.message || t('error_message'));
        }
    }
    
    const validationSchema = Yup.object({
        name: Yup.string().required(t('name_required')),
        type: Yup.string().required(t('type_required')),
        volume: Yup.number()
            .required(t('volume_required'))
            .positive(t('volume_positive'))
            .typeError(t('volume_must_be_number')),
        price: Yup.number()
            .required(t('price_required'))
            .positive(t('price_positive'))
            .typeError(t('price_must_be_number')),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            type: "",
            volume: "",
            expireDate: "",
            price: "",
        },
        validationSchema,
        onSubmit: submitTreatment,
    });

    const resetForm = () => {
        formik.resetForm();
        setIsSubmitted(false);
        setTreatmentData(null);
    };

    return (
        <div className="treatment-container">
            <div className="treatment-header">
                <h1>{t('treatment')}</h1>
            </div>

            {error && <div className="error-message">{error}</div>}
            
            {treatmentData && (
                <div className="success-message">
                    <h3>{t('treatment_added_successfully')}</h3>
                    <p>{treatmentData.name}</p>
                </div>
            )}

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
                                disabled={isSubmitted}
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
                                disabled={isSubmitted}
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
                                disabled={isSubmitted}
                                placeholder={t('enter_treatment_volume')}
                            />
                            {formik.errors.volume && formik.touched.volume && (
                                <p className="error-message">{formik.errors.volume}</p>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="expireDate">{t('expire_date')}</label>
                            <input
                                id="expireDate"
                                type="date"
                                {...formik.getFieldProps('expireDate')}
                                disabled={isSubmitted}
                            />
                            {formik.errors.expireDate && formik.touched.expireDate && (
                                <p className="error-message">{formik.errors.expireDate}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="price">{t('price')}</label>
                            <input
                                id="price"
                                type="number"
                                {...formik.getFieldProps('price')}
                                disabled={isSubmitted}
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
                        <button 
                            type="submit" 
                            className="save-button"
                            disabled={isSubmitted || !formik.isValid}
                        >
                            <IoIosSave /> {t('save')}
                        </button>
                    )}

                    {isSubmitted && (
                        <button 
                            type="button" 
                            className="save-button"
                            onClick={resetForm}
                        >
                            {t('add_new_treatment')}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default Treatment;