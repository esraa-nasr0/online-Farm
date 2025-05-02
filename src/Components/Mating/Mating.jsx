import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { IoIosSave } from "react-icons/io";
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

function Mating() {
    const [showAlert, setShowAlert] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const [matingData, setMatingData] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false); // حالة جديدة لتتبع الإرسال
    const { t } = useTranslation();

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return { Authorization: formattedToken };
    };

    async function submitMating(value) {
        // إذا كانت البيانات قد أرسلت بالفعل، لا تفعل شيئاً
        if (isSubmitted) {
            return;
        }

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
                setIsSubmitted(true); // تحديث حالة الإرسال
                
                // إعادة تعيين النموذج
                formik.resetForm();
                
                Swal.fire({
                    title: t('success_title'),
                    text: t('mating_success_message'),
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
            sonarDate: '',
            sonarRsult: null,
        },
        onSubmit: submitMating
    });

    return (
        <div className="container">
            <div className="title2">{t('mating')}</div>
            <p className="text-danger">{error}</p>
            {showAlert && matingData && matingData.expectedDeliveryDate && (
                <div className="alert mt-5 p-4 alert-success">
                    {t('expected_delivery_date')}: {new Date(matingData.expectedDeliveryDate).toLocaleDateString()}
                </div>
            )}
            <form onSubmit={formik.handleSubmit} className="mt-5">
                
                {isLoading ? (
                    <button type="submit" className="btn button2" disabled>
                        <i className="fas fa-spinner fa-spin"></i>
                    </button>
                ) : (
                    <button 
                        type="submit" 
                        className="btn button2"
                        disabled={isSubmitted} // تعطيل الزر إذا تم الإرسال
                    >
                        <IoIosSave /> {t('save')}
                    </button>
                )}
                <div className="animaldata">
                    <div className="input-box">
                        <label className="label" htmlFor="tagId">{t('female_tag_id')}</label>
                        <input 
                            onBlur={formik.handleBlur} 
                            onChange={formik.handleChange} 
                            value={formik.values.tagId} 
                            placeholder={t('enter_tag_id')} 
                            id="tagId" 
                            type="text" 
                            className="input2" 
                            name="tagId" 
                            disabled={isSubmitted} // تعطيل الحقل إذا تم الإرسال
                        />
                    </div>
                    <div className="input-box">
                        <label className="label" htmlFor="matingType">{t('mating_type')}</label>
                        <select 
                            value={formik.values.matingType} 
                            onChange={formik.handleChange} 
                            onBlur={formik.handleBlur} 
                            className="input2" 
                            name="matingType" 
                            id="matingType"
                            disabled={isSubmitted} // تعطيل الحقل إذا تم الإرسال
                        >
                            <option value="">{t('mating_type')}</option>
                            <option value="Natural">{t('natural')}</option>
                        </select>
                    </div>
                    <div className="input-box">
                        <label className="label" htmlFor="maleTag_id">{t('male_tag_id')}</label>
                        <input 
                            onBlur={formik.handleBlur} 
                            onChange={formik.handleChange} 
                            value={formik.values.maleTag_id} 
                            placeholder={t('enter_male_tag_id')} 
                            id="maleTag_id" 
                            type="text" 
                            className="input2" 
                            name="maleTag_id" 
                            disabled={isSubmitted} // تعطيل الحقل إذا تم الإرسال
                        />
                    </div>
                    <div className="input-box">
                        <label className="label" htmlFor="matingDate">{t('mating_date')}</label>
                        <input 
                            onBlur={formik.handleBlur} 
                            onChange={formik.handleChange} 
                            value={formik.values.matingDate} 
                            id="matingDate" 
                            type="date" 
                            className="input2" 
                            name="matingDate" 
                            disabled={isSubmitted} // تعطيل الحقل إذا تم الإرسال
                        />
                    </div>
                    <div className="input-box">
                        <label className="label" htmlFor="sonarDate">{t('sonar_date')}</label>
                        <input 
                            onBlur={formik.handleBlur} 
                            onChange={formik.handleChange} 
                            value={formik.values.sonarDate} 
                            id="sonarDate" 
                            type="date" 
                            className="input2" 
                            name="sonarDate" 
                            disabled={isSubmitted} // تعطيل الحقل إذا تم الإرسال
                        />
                    </div>
                    <div className="input-box">
                        <label className="label" htmlFor="sonarRsult">{t('sonar_result')}</label>
                        <select 
                            onBlur={formik.handleBlur} 
                            onChange={formik.handleChange} 
                            value={formik.values.sonarRsult} 
                            id="sonarRsult" 
                            className="input2" 
                            name="sonarRsult"
                            disabled={isSubmitted} // تعطيل الحقل إذا تم الإرسال
                        >
                            <option value="" disabled>{t('select_sonar_result')}</option>
                            <option value="positive">{t('positive')}</option>
                            <option value="negative">{t('negative')}</option>
                        </select>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Mating;