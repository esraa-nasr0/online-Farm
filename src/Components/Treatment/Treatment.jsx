import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { IoIosSave } from "react-icons/io";
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

function Treatment() {
    const { t } = useTranslation();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [treatmentData, setTreatmentData] = useState(null);

    // Helper function to generate headers with the latest token
    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
      
        // Ensure the token has only one "Bearer" prefix
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
      
        return {
            Authorization: formattedToken
        };
    };

    async function submitTreatment(values) {
        const headers = getHeaders(); // Get the latest headers
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
                console.log(data.data.treatment);
                setTreatmentData(data.data.treatment);
                Swal.fire({
                    title: t('success'),
                    text: t('mating_success_message'),
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
        volume: Yup.number().required(t('volume_required')).positive(t('volume_positive')),
        price: Yup.number().required(t('price_required')).positive(t('price_positive')),
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
        <div className='container'>
            <div className="title2">{t('treatment')}</div>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={formik.handleSubmit} className='mt-5'>
                {isLoading ? (
                    <button type="submit" className="btn button2" disabled>
                        <i className="fas fa-spinner fa-spin"></i>
                    </button>
                ) : (
                    <button type="submit" className="btn button2">
                        <IoIosSave /> {t('save')}
                    </button>
                )}

                <div className='animaldata'>
                    <div className="input-box">
                        <label className="label" htmlFor="name">{t('name')}</label>
                        <input
                            autoComplete="off"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.name}
                            id="name"
                            placeholder={t('enter_treatment_name')}
                            type="text"
                            className="input2"
                            name="name"
                            aria-label={t('treatment_name')}
                        />
                        {formik.errors.name && formik.touched.name && <p className="text-danger">{formik.errors.name}</p>}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="type">{t('type')}</label>
                        <input
                            autoComplete="off"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.type}
                            id="type"
                            placeholder={t('enter_treatment_type')}
                            type="text"
                            className="input2"
                            name="type"
                            aria-label={t('treatment_type')}
                        />
                        {formik.errors.type && formik.touched.type && <p className="text-danger">{formik.errors.type}</p>}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="volume">{t('volume')}</label>
                        <input
                            autoComplete="off"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.volume}
                            placeholder={t('enter_treatment_volume')}
                            id="volume"
                            type="number"
                            className="input2"
                            name="volume"
                            aria-label={t('treatment_volume')}
                        />
                        {formik.errors.volume && formik.touched.volume && <p className="text-danger">{formik.errors.volume}</p>}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="price">{t('price')}</label>
                        <input
                            autoComplete="off"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.price}
                            placeholder={t('enter_treatment_price')}
                            id="price"
                            type="number"
                            className="input2"
                            name="price"
                            aria-label={t('treatment_price')}
                        />
                        {formik.errors.price && formik.touched.price && <p className="text-danger">{formik.errors.price}</p>}
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Treatment;
