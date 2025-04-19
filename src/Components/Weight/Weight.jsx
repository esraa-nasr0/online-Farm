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

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return {
            Authorization: formattedToken
        };
    };

    async function submitWeight(value) {
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
                Swal.fire({
                    title: t('success'),
                    text: t('weight_added_successfully'),
                    icon: 'success',
                    confirmButtonText: t('ok'),
                });
                navigate('/weightTable');
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
        weight: Yup.string()
            .max(10, t('weight_max'))
            .required(t('weight_required')),
        height: Yup.string()
            .max(10, t('height_max'))
            .required(t('height_required')),
        Date: Yup.date().required(t('date_required')),
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
            <p className="text-danger">{error}</p>

            <form onSubmit={formik.handleSubmit} className="mt-5">
                {isLoading ? (
                    <button type="submit" className="btn button2" disabled>
                        <i className="fas fa-spinner fa-spin"></i>
                    </button>
                ) : (
                    <button type="submit" className="btn button2">
                        <IoIosSave /> {t('save')}
                    </button>
                )}
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
                        <label className="label" htmlFor="weight">{t('weight')}</label>
                        <input
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.weight}
                            placeholder={t('enter_weight')}
                            id="weight"
                            type="text"
                            className="input2"
                            name="weight"
                        />
                        {formik.errors.weight && formik.touched.weight && (
                            <p className="text-danger">{formik.errors.weight}</p>
                        )}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="height">{t('height')}</label>
                        <input
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.height}
                            placeholder={t('enter_height')}
                            id="height"
                            type="text"
                            className="input2"
                            name="height"
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
