import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { IoIosSave } from "react-icons/io";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Mating.css';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';



function EditMating() {
    const { t } = useTranslation();
    const [showAlert, setShowAlert] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const [matingData, setMatingData] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return { Authorization: formattedToken };
    };
    
    const fetchMaleTags = async () => {
    const headers = getHeaders();
    const res = await axios.get('https://farm-project-bbzj.onrender.com/api/animal/males', { headers });
    return res.data.data;
};

const { data: maleTags, isLoading: maleTagsLoading, error: maleTagsError } = useQuery({
    queryKey: ['maleTagsId'],
    queryFn: fetchMaleTags
});


    async function editMating(values) {
        const headers = getHeaders();
        setisLoading(true); 
        try {
            const convertToISO = (dateString) => {
                if (!dateString) return undefined;
                const date = new Date(dateString);
                return isNaN(date) ? undefined : date.toISOString();
            };

            const updatedValues = {
                ...values,
                matingDate: convertToISO(values.matingDate),
                sonarDate: convertToISO(values.sonarDate),
                expectedDeliveryDate: convertToISO(values.expectedDeliveryDate),
            };
            const payload = Object.fromEntries(
                Object.entries(updatedValues).filter(([_, v]) => v !== undefined)
            );
            console.log('Submitting form with values:', payload);
            let { data } = await axios.patch(
                `https://farm-project-bbzj.onrender.com/api/mating/UpdateMating/${id}`,
                payload,
                { headers }
            );

            if (data.status === "success") {
                setisLoading(false);
                setMatingData(data.data.mating);
                setShowAlert(true);
                Swal.fire({
                    title: t('success_title'),
                    text: t('animal_update_success'),
                    icon: 'success',
                    confirmButtonText: t('ok')
                 });
                
                    navigate('/matingTable');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "An error occurred while processing your request";
            setError(errorMessage);
            console.log(err.response?.data);
            setisLoading(false);
        }
    }

    useEffect(() => {
        async function fetchAnimal() {
            const headers = getHeaders();
            try {
                let { data } = await axios.get(
                    `https://farm-project-bbzj.onrender.com/api/mating/GetSingleMating/${id}`, 
                    { headers }
                );
                console.log("API response:", data); 
    
                if (data && data.data && data.data.mating) {
                    const mating = data.data.mating;
                    const formatDate = (dateString) => dateString ? new Date(dateString).toISOString().split('T')[0] : '';

                    formik.setValues({
                        tagId: mating.tagId || '',
                        matingType: mating.matingType || '',
                        maleTag_id: mating.maleTag_id || '',
                        matingDate: formatDate(mating.matingDate),
                        sonarDate: formatDate(mating.sonarDate),
                        checkDays: mating.checkDays || null,
                        sonarRsult: mating.sonarRsult || null,
                        expectedDeliveryDate: formatDate(mating.expectedDeliveryDate) || '',
                    });
                } else {
                    throw new Error("Unexpected API response structure");
                }
            } catch (error) {
                console.error("Failed to fetch animal data:", error);
                setError("Failed to fetch animal details.");
            }
        }
        fetchAnimal();
    }, [id]);

    const formik = useFormik({
        initialValues: {
            tagId: '',
            matingType: '',
            maleTag_id: '',
            matingDate: '',
            checkDays: null,
            sonarRsult: null,
            expectedDeliveryDate: '',
            sonarDate: '',
        },
        onSubmit: (values) => editMating(values),
    });

    return (
        <div className="mating-details-container">
            <div className="mating-details-header">
                <h1>{t('edit_mating')}</h1>
            </div>

            {error && <div className="error-message">{error}</div>}
            
            {showAlert && matingData && matingData.expectedDeliveryDate && (
                <div className="success-message">
                    <h3>{t('expected_delivery_date')}</h3>
                    <p>{new Date(matingData.expectedDeliveryDate).toLocaleDateString()}</p>
                </div>
            )}

            <form onSubmit={formik.handleSubmit} className="mating-form">
                <div className="form-grid">
                    <div className="form-section">
                        <h2>{t('basic_info')}</h2>
                        <div className="input-group">
                            <label htmlFor="tagId">{t('tag_id')}</label>
                            <input
                                type="text"
                                id="tagId"
                                name="tagId"
                                value={formik.values.tagId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
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
                            >
                                <option value="">{t('mating_type')}</option>
                                <option value="Natural">{t('natural')}</option>
                            </select>
                            {formik.errors.matingType && formik.touched.matingType && (
                                <p className="text-danger">{formik.errors.matingType}</p>
                            )}
                        </div>

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
                        </div>

                    <div className="form-section">
                        <h2>{t('mating_details')}</h2>
                        <div className="input-group">
                            <label htmlFor="matingDate">{t('mating_date')}</label>
                            <input
                                type="date"
                                id="matingDate"
                                name="matingDate"
                                value={formik.values.matingDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
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

                        <div className="input-group">
                            <label htmlFor="sonarRsult">{t('sonar_result')}</label>
                            <select
                                id="sonarRsult"
                                name="sonarRsult"
                                value={formik.values.sonarRsult}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="" disabled>{t('select_sonar_result')}</option>
                                <option value="positive">{t('positive')}</option>
                                <option value="negative">{t('negative')}</option>
                            </select>
                            {formik.errors.sonarRsult && formik.touched.sonarRsult && (
                                <p className="text-danger">{formik.errors.sonarRsult}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="sonarDate">{t('sonar_date')}</label>
                            <input
                                type="date"
                                id="sonarDate"
                                name="sonarDate"
                                value={formik.values.sonarDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.sonarDate && formik.touched.sonarDate && (
                                <p className="text-danger">{formik.errors.sonarDate}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="expectedDeliveryDate">{t('expected_delivery_date')}</label>
                            <input
                                type="date"
                                id="expectedDeliveryDate"
                                name="expectedDeliveryDate"
                                value={formik.values.expectedDeliveryDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.expectedDeliveryDate && formik.touched.expectedDeliveryDate && (
                                <p className="text-danger">{formik.errors.expectedDeliveryDate}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="save-button" disabled={isLoading}>
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

export default EditMating; 
