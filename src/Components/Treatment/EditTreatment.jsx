import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { IoIosSave } from "react-icons/io";
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function EditTreatment() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();
    const { t } = useTranslation(); // Using i18next translation hook

    // Helper function to generate headers with the latest token
    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        // Ensure the token has only one "Bearer" prefix
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return {
            Authorization: formattedToken
        };
    };

    // Submit the updated treatment data
    async function submitTreatment(values) {
        const headers = getHeaders(); // Get the latest headers
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
                    title: t('successTitle'), // Translating success title
                    text: t('treatmentUpdated'), // Translating success message
                    icon: 'success',
                    confirmButtonText: t('ok'), // Translating button text
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || t('errorOccurred')); // Translating error message
        } finally {
            setIsLoading(false);
        }
    }

    // Fetch the treatment data
    useEffect(() => {
        async function fetchTreatment() {
            const headers = getHeaders(); // Get the latest headers
            setError(null);
            try {
                const { data } = await axios.get(
                    `https://farm-project-bbzj.onrender.com/api/treatment/getsingletreatment/${id}`,
                    { headers }
                );
                if (data && data.data && data.data.treatment) {
                    const treatment = data.data.treatment;
                    // Populate Formik with the fetched data
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
                setError(t('fetchError')); // Translating fetch error message
            }
        }
        fetchTreatment();
    }, [id]);

    // Validation schema for Formik
    const validationSchema = Yup.object({
        name: Yup.string().required(t('nameRequired')), // Translating validation messages
        type: Yup.string().required(t('typeRequired')),
        volume: Yup.number().required(t('volumeRequired')).positive(t('volumePositive')),
        price: Yup.number().required(t('priceRequired')).positive(t('pricePositive')),
    });

    // Initialize Formik
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
        <div className='container'>
            <div className="title2">{t('editTreatment')}</div> {/* Translating title */}
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={formik.handleSubmit} className='mt-5'>
                {isLoading ? (
                    <button type="submit" className="btn button2" disabled>
                        <i className="fas fa-spinner fa-spin"></i>
                    </button>
                ) : (
                    <button type="submit" className="btn button2">
                        <IoIosSave /> {t('save')} {/* Translating button text */}
                    </button>
                )}

                <div className='animaldata'>
                    <div className="input-box">
                        <label className="label" htmlFor="name">{t('name')}</label> {/* Translating label */}
                        <input
                            autoComplete="off"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.name}
                            id="name"
                            type="text"
                            className="input2"
                            name="name"
                            aria-label={t('treatmentName')}
                        />
                        {formik.errors.name && formik.touched.name && <p className="text-danger">{formik.errors.name}</p>}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="type">{t('type')}</label> {/* Translating label */}
                        <input
                            autoComplete="off"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.type}
                            id="type"
                            type="text"
                            className="input2"
                            name="type"
                            aria-label={t('treatmentType')}
                        />
                        {formik.errors.type && formik.touched.type && <p className="text-danger">{formik.errors.type}</p>}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="volume">{t('volume')}</label> {/* Translating label */}
                        <input
                            autoComplete="off"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.volume}
                            id="volume"
                            type="number"
                            className="input2"
                            name="volume"
                            aria-label={t('treatmentVolume')}
                        />
                        {formik.errors.volume && formik.touched.volume && <p className="text-danger">{formik.errors.volume}</p>}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="price">{t('price')}</label> {/* Translating label */}
                        <input
                            autoComplete="off"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.price}
                            id="price"
                            type="number"
                            className="input2"
                            name="price"
                            aria-label={t('treatmentPrice')}
                        />
                        {formik.errors.price && formik.touched.price && <p className="text-danger">{formik.errors.price}</p>}
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditTreatment;
