import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from "yup";
import { IoIosSave } from "react-icons/io";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

function Weight() {
    const { t } = useTranslation();
    let navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false); // حالة جديدة لتتبع الإرسال

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return {
            Authorization: formattedToken
        };
    };

    async function submitWeight(value) {
        // إذا كانت البيانات قد أرسلت بالفعل، لا تفعل شيئاً
        if (isSubmitted) {
            return;
        }

        const headers = getHeaders();
        setIsLoading(true);
        setError(null);
        try {
            let { data } = await axios.post(
                `https://farm-project-bbzj.onrender.com/api/weight/AddWeight`,
                value,
                { headers }
            );
            if (data.status === "success") {
                setIsLoading(false);
                setIsSubmitted(true); // تحديث حالة الإرسال
                Swal.fire({
                    title: t('success'),
                    text: t('weight_added_successfully'),
                    icon: 'success',
                    confirmButtonText: t('ok'),
                }).then(() => {
                    navigate('/weightTable');
                });
            }
        } catch (err) {
            setIsLoading(false);
            setError(err.response?.data?.message || t('error_occurred'));
        }
    }

    let validation = Yup.object({
        tagId: Yup.string()
            .max(10, t('tag_id_max'))
            .required(t('tag_id_required')),
        weightType: Yup.string().required(t('weight_type_required')),
        weight: Yup.number() // تغيير لنوع number بدلاً من string
            .max(1000, t('weight_max'))
            .positive(t('weight_positive'))
            .required(t('weight_required')),
        height: Yup.number() // تغيير لنوع number بدلاً من string
            .max(300, t('height_max'))
            .positive(t('height_positive'))
            .required(t('height_required')),
        Date: Yup.date()
            .required(t('date_required'))
            .max(new Date(), t('date_cannot_be_future')),
    });

    let formik = useFormik({
        initialValues: {
            tagId: '',
            weightType: '',
            weight: '',
            height: '',
            Date: '',
        },
        validationSchema: validation,
        onSubmit: submitWeight,
    });

    return (
        <div className="container">
            <div className="title2">{t('weight')}</div>
            {error && <p className="text-danger">{error}</p>}
            {isSubmitted && (
                <div className="alert alert-success mt-3">
                    {t('weight_data_saved_successfully')}
                </div>
            )}

            <form onSubmit={formik.handleSubmit} className="mt-5">
                <button 
                    type="submit" 
                    className="btn button2"
                    disabled={isLoading || isSubmitted || !formik.isValid}
                >
                    {isLoading ? (
                        <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                        <>
                            <IoIosSave /> {t('save')}
                        </>
                    )}
                </button>

                <div className="animaldata">
                    <div className="input-box">
                        <label className="label" htmlFor="tagId">{t('tag_id')}</label>
                        <input
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.tagId}
                            placeholder={t('enter_tag_id')}
                            id="tagId"
                            type="text"
                            className="input2"
                            name="tagId"
                            disabled={isSubmitted}
                        />
                        {formik.errors.tagId && formik.touched.tagId && (
                            <p className="text-danger">{formik.errors.tagId}</p>
                        )}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="weightType">{t('weight_type')}</label>
                        <select
                            value={formik.values.weightType}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="input2"
                            name="weightType"
                            id="weightType"
                            disabled={isSubmitted}
                        >
                            <option value="">{t('select_weight_type')}</option>
                            <option value="birth">{t('birth')}</option>
                            <option value="Weaning">{t('weaning')}</option>
                            <option value="regular">{t('regular')}</option>
                        </select>
                        {formik.errors.weightType && formik.touched.weightType && (
                            <p className="text-danger">{formik.errors.weightType}</p>
                        )}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="weight">{t('weight')} (kg)</label>
                        <input
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.weight}
                            placeholder={t('enter_weight')}
                            id="weight"
                            type="number"
                            step="0.01"
                            className="input2"
                            name="weight"
                            disabled={isSubmitted}
                        />
                        {formik.errors.weight && formik.touched.weight && (
                            <p className="text-danger">{formik.errors.weight}</p>
                        )}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="height">{t('height')} (cm)</label>
                        <input
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.height}
                            placeholder={t('enter_height')}
                            id="height"
                            type="number"
                            step="0.1"
                            className="input2"
                            name="height"
                            disabled={isSubmitted}
                        />
                        {formik.errors.height && formik.touched.height && (
                            <p className="text-danger">{formik.errors.height}</p>
                        )}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="Date">{t('date')}</label>
                        <input
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.Date}
                            id="Date"
                            type="date"
                            className="input2"
                            name="Date"
                            disabled={isSubmitted}
                            max={new Date().toISOString().split('T')[0]} // لا تسمح بتواريخ في المستقبل
                        />
                        {formik.errors.Date && formik.touched.Date && (
                            <p className="text-danger">{formik.errors.Date}</p>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Weight;