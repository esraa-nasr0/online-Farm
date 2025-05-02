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
    const [isSubmitted, setIsSubmitted] = useState(false); // حالة جديدة لتتبع الإرسال

    // Helper function to generate headers with the latest token
    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return { Authorization: formattedToken };
    };

    async function submitTreatment(values) {
        // إذا كانت البيانات قد أرسلت بالفعل، لا تفعل شيئاً
        if (isSubmitted) {
            return;
        }

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
                setIsSubmitted(true); // تحديث حالة الإرسال
                setTreatmentData(data.data.treatment);
                formik.resetForm(); // إعادة تعيين النموذج بعد النجاح
                
                Swal.fire({
                    title: t('success'),
                    text: t('treatment_success_message'), // تغيير الرسالة لتكون خاصة بالعلاج
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
            .typeError(t('volume_must_be_number')), // رسالة خطأ عند إدخال غير رقمي
        price: Yup.number()
            .required(t('price_required'))
            .positive(t('price_positive'))
            .typeError(t('price_must_be_number')), // رسالة خطأ عند إدخال غير رقمي
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

    // دالة لإعادة تعيين النموذج والسماح بإدخال جديد
    const resetForm = () => {
        formik.resetForm();
        setIsSubmitted(false);
        setTreatmentData(null);
    };

    return (
        <div className='container'>
            <div className="title2">{t('treatment')}</div>
            {error && <p className="text-danger">{error}</p>}
            
            {treatmentData && (
                <div className="alert mt-3 alert-success">
                    {t('treatment_added_successfully')}: {treatmentData.name}
                </div>
            )}

            <form onSubmit={formik.handleSubmit} className='mt-5'>
                <div className='d-flex justify-content-between mb-4'>
                    {isLoading ? (
                        <button type="submit" className="btn button2" disabled>
                            <i className="fas fa-spinner fa-spin"></i> {t('saving')}
                        </button>
                    ) : (
                        <button 
                            type="submit" 
                            className="btn button2"
                            disabled={isSubmitted || !formik.isValid}
                        >
                            <IoIosSave /> {t('save')}
                        </button>
                    )}

                    {/* زر إضافة علاج جديد */}
                    {isSubmitted && (
                        <button 
                            type="button" 
                            className="btn button2"
                            onClick={resetForm}
                        >
                            {t('add_new_treatment')}
                        </button>
                    )}
                </div>

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
                            disabled={isSubmitted} // تعطيل الحقل إذا تم الإرسال
                            aria-label={t('treatment_name')}
                        />
                        {formik.errors.name && formik.touched.name && (
                            <p className="text-danger">{formik.errors.name}</p>
                        )}
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
                            disabled={isSubmitted} // تعطيل الحقل إذا تم الإرسال
                            aria-label={t('treatment_type')}
                        />
                        {formik.errors.type && formik.touched.type && (
                            <p className="text-danger">{formik.errors.type}</p>
                        )}
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
                            disabled={isSubmitted} // تعطيل الحقل إذا تم الإرسال
                            aria-label={t('treatment_volume')}
                        />
                        {formik.errors.volume && formik.touched.volume && (
                            <p className="text-danger">{formik.errors.volume}</p>
                        )}
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
                            disabled={isSubmitted} // تعطيل الحقل إذا تم الإرسال
                            aria-label={t('treatment_price')}
                        />
                        {formik.errors.price && formik.touched.price && (
                            <p className="text-danger">{formik.errors.price}</p>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Treatment;