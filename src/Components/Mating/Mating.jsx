import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { IoIosSave } from "react-icons/io";
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './Mating.css';

function Mating() {
    const [showAlert, setShowAlert] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const [matingData, setMatingData] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { t } = useTranslation();
    let navigate = useNavigate();

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return { Authorization: formattedToken };
    };

    async function submitMating(value) {
        if (isSubmitted) {
            return;
        }
        value.checkDays = parseInt(value.checkDays, 10);

        const headers = getHeaders();
        setisLoading(true); 
        try {
            let { data } = await axios.post(
                `https://farm-project-bbzj.onrender.com/api/mating/addmating`,
                value,
                { headers }
            );

            if (data.status === "success") {
                setisLoading(false);
                setMatingData(data.data.mating);
                setShowAlert(true);
                setIsSubmitted(true);
                formik.setFieldValue('sonarDate', data.data.mating.sonarDate);
                formik.resetForm();
                
                Swal.fire({
                    title: t('success_title'),
                    text: t('mating_success_message'),
                    icon: 'success',
                    confirmButtonText: t('ok')
                });
                navigate('/matingtable');
            }
        } catch (err) {
            setisLoading(false);
            const errorMessage = err.response?.data?.message || t('error_message');
            setError(errorMessage);
        }
    }

    let formik = useFormik({
        initialValues: {
            tagId: '',
            matingType: '',
            maleTag_id: '',
            matingDate: '',
            checkDays: '',
            sonarRsult: null,
        },
        onSubmit: submitMating
    });

    return (
        <div className="mating-details-container">
            <div className="mating-details-header">
                <h1>{t('mating')}</h1>
            </div>

            {error && <div className="error-message">{error}</div>}
            
            {showAlert && matingData && matingData.sonarDate && (
                <div className="success-message">
                    <h3>{t('sonar_date')}</h3>
                    <p>{new Date(matingData.sonarDate).toLocaleDateString()}</p>
                </div>
            )}

            <form onSubmit={formik.handleSubmit} className="mating-form">
                <div className="form-grid">
                    <div className="form-section">
                        <h2>{t('basic_info')}</h2>
                        <div className="input-group">
                            <label htmlFor="tagId">{t('female_tag_id')}</label>
                            <input 
                                type="text"
                                id="tagId"
                                name="tagId"
                                value={formik.values.tagId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={isSubmitted}
                                placeholder={t('enter_tag_id')}
                            />
                            {formik.errors.tagId && formik.touched.tagId && (
                                <p className="text-danger">{formik.errors.tagId}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="matingType">{t('mating_type')}</label>
                            <select 
                                id="matingType"
                                name="matingType"
                                value={formik.values.matingType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={isSubmitted}
                            >
                                <option value="">{t('mating_type')}</option>
                                <option value="Natural">{t('natural')}</option>
                            </select>
                            {formik.errors.matingType && formik.touched.matingType && (
                                <p className="text-danger">{formik.errors.matingType}</p>
                            )}
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>{t('mating_details')}</h2>
                        <div className="input-group">
                            <label htmlFor="maleTag_id">{t('male_tag_id')}</label>
                            <input 
                                type="text"
                                id="maleTag_id"
                                name="maleTag_id"
                                value={formik.values.maleTag_id}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={isSubmitted}
                                placeholder={t('enter_male_tag_id')}
                            />
                            {formik.errors.maleTag_id && formik.touched.maleTag_id && (
                                <p className="text-danger">{formik.errors.maleTag_id}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="matingDate">{t('mating_date')}</label>
                            <input 
                                type="date"
                                id="matingDate"
                                name="matingDate"
                                value={formik.values.matingDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={isSubmitted}
                            />
                            {formik.errors.matingDate && formik.touched.matingDate && (
                                <p className="text-danger">{formik.errors.matingDate}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="checkDays">{t('check_Days')}</label>
                            <select 
                                id="checkDays"
                                name="checkDays"
                                value={formik.values.checkDays}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={isSubmitted}
                            >
                                <option value="" disabled>{t('select_check_Days')}</option>
                                <option value="45">{t('45')}</option>
                                <option value="60">{t('60')}</option>
                                <option value="90">{t('90')}</option>
                            </select>
                            {formik.errors.checkDays && formik.touched.checkDays && (
                                <p className="text-danger">{formik.errors.checkDays}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="save-button" disabled={isLoading || isSubmitted}>
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

export default Mating;