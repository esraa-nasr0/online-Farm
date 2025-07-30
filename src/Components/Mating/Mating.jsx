import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { IoIosSave } from "react-icons/io";
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import './Mating.css';
import { useQuery } from '@tanstack/react-query';

function Mating() {
    const [showAlert, setShowAlert] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const [matingData, setMatingData] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { t } = useTranslation();

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return { Authorization: formattedToken };
    };

    const fetchMaleTags = async () => {
        const headers = getHeaders();
        const res = await axios.get(
            'https://farm-project-bbzj.onrender.com/api/animal/males',
            { headers }
        );
        return res.data.data;
    };

    const { data: maleTags, isLoading: maleTagsLoading, error: maleTagsError } = useQuery({
        queryKey: ['maleTags'],
        queryFn: fetchMaleTags
    });

    async function submitMating(value) {
        if (isSubmitted) return;

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
                formik.resetForm();

                Swal.fire({
                    title: t('success_title'),
                    html: `
                        <p>${t('mating_success_message')}</p>
                        <p><strong>${t('sonar_date')}:</strong> ${new Date(data.data.mating.sonarDate).toLocaleDateString()}</p>
                    `,
                    icon: 'success',
                    confirmButtonText: t('ok')
                });
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
                            <select
                                id="maleTag_id"
                                name="maleTag_id"
                                value={formik.values.maleTag_id}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">{t('select_male_tag_id')}</option>
                                {maleTags && maleTags.map(tag => (
                                    <option key={tag} value={tag}>{tag}</option>
                                ))}
                            </select>
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
                    <button
                        type="submit"
                        className="save-button"
                        disabled={isLoading || isSubmitted}
                        onClick={() => {
                            formik.handleSubmit();
                        }}
                    >
                        {isLoading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            <>
                                <IoIosSave /> {t('save')}
                            </>
                        )}
                    </button>

                    {isSubmitted && (
                        <button
                            type="button"
                            className="save-button"
                            onClick={() => {
                                formik.resetForm();
                                setIsSubmitted(false);
                                setMatingData(null);
                                setShowAlert(false);
                            }}
                        >
                            {t('add_new_mating')}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default Mating;
