import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { IoIosSave } from "react-icons/io";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import './Feeding.css';
import { useTranslation } from 'react-i18next';

export default function Feed() {
    const [isLoading, setIsLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return { Authorization: formattedToken };
    };

    async function handleSubmit(values) {
        const headers = getHeaders();
        try {
            setIsLoading(true);
            const dataToSubmit = {
                ...values,
            };

            const { data } = await axios.post(
                "https://farm-project-bbzj.onrender.com/api/feed/addfeed",
                dataToSubmit,
                { headers }
            );

            if (data.status === "success") {
                setIsSubmitted(true);
                setIsLoading(false);
                setShowAlert(true);
                Swal.fire({
                    title: t('success'),
                    text: t('data_submitted_success'),
                    icon: "success",
                    confirmButtonText: t('ok'),
                })
            }
        } catch (err) {
            Swal.fire({
                title: t('error'),
                text: err.response?.data?.message || t('submit_error'),
                icon: "error",
                confirmButtonText: t('ok'),
            });
        } finally {
            setIsLoading(false);
        }
    }

    const validationSchema = Yup.object({
        name: Yup.string().required(t('name_required')),
        type: Yup.string().required(t('type_required')),
        price: Yup.number().required(t('price_required')),
        concentrationOfDryMatter: Yup.number().required(t('dry_matter_required')),
        quantity: Yup.number().required(t('quantity_required')),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            type: "",
            price: "",
            concentrationOfDryMatter: "",
            quantity: "",
        },
        validationSchema,
        onSubmit: handleSubmit,
    });

    return (
        <div className="feeding-container">
            <div className="feeding-header">
                <h1>{t('add_feed')}</h1>
            </div>

            <form onSubmit={formik.handleSubmit} className="feeding-form">
                <div className="form-grid">
                    <div className="form-section">
                        <h2>{t('feed_info')}</h2>
                        <div className="input-group">
                            <label htmlFor="name">{t('name')}</label>
                            <input
                                {...formik.getFieldProps("name")}
                                placeholder={t('enter_feed_name')}
                                id="name"
                                type="text"
                            />
                            {formik.touched.name && formik.errors.name && (
                                <p className="text-danger">{formik.errors.name}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="type">{t('type')}</label>
                            <input
                                {...formik.getFieldProps("type")}
                                placeholder={t('enter_feed_type')}
                                id="type"
                                type="text"
                            />
                            {formik.touched.type && formik.errors.type && (
                                <p className="text-danger">{formik.errors.type}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="price">{t('price_per_ton')}</label>
                            <input
                                {...formik.getFieldProps("price")}
                                placeholder={t('enter_price')}
                                id="price"
                                type="text"
                            />
                            {formik.touched.price && formik.errors.price && (
                                <p className="text-danger">{formik.errors.price}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="concentrationOfDryMatter">
                                {t('dry_matter_concentration')} (%)
                            </label>
                            <input
                                {...formik.getFieldProps("concentrationOfDryMatter")}
                                placeholder={t('enter_dry_matter')}
                                id="concentrationOfDryMatter"
                                type="text"
                            />
                            {formik.touched.concentrationOfDryMatter && 
                            formik.errors.concentrationOfDryMatter && (
                                <p className="text-danger">{formik.errors.concentrationOfDryMatter}</p>
                            )}
                        </div>
                        
                        <div className="input-group">
                            <label htmlFor="quantity">{t('quantity')} (ton)</label>
                            <input
                                {...formik.getFieldProps("quantity")}
                                placeholder={t('enter_quantity')}
                                id="quantity"
                                type="text"
                            />
                            {formik.touched.quantity && formik.errors.quantity && (
                                <p className="text-danger">{formik.errors.quantity}</p>
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
                    {isSubmitted && (
        <button
            type="button"
            className="save-button"
            onClick={() => {
                formik.resetForm();
                setIsSubmitted(false);
            }}
        >
             {t('add_new_feed')}
        </button>
    )}
                </div>
            </form>
        </div>
    );
}