import axios from 'axios';
import { useFormik } from 'formik';
import React, { useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { IoIosSave } from "react-icons/io";
import * as Yup from 'yup';
import { TreatmentContext } from '../../Context/TreatmentContext';
import { useTranslation } from 'react-i18next';

function TreatmentAnimal() {
    const { t } = useTranslation();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [treatmentOptions, setTreatmentOptions] = useState([]); // تغيير الاسم لتجنب الخلط
    const [isSubmitted, setIsSubmitted] = useState(false); // حالة جديدة لتتبع الإرسال
    const { getTreatmentMenue } = useContext(TreatmentContext);

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return { Authorization: formattedToken };
    };

    const fetchTreatments = async () => {
        try {
            const { data } = await getTreatmentMenue();
            if (data.status === 'success' && Array.isArray(data.data)) {
                setTreatmentOptions(data.data);
            } else {
                setTreatmentOptions([]);
            }
        } catch (err) {
            setError(t('failed_to_load_treatment_data'));
            setTreatmentOptions([]);
        }
    };

    useEffect(() => {
        fetchTreatments();
    }, [getTreatmentMenue]);

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
                `https://farm-project-bbzj.onrender.com/api/treatment/addtreatmentbyanimal`,
                values,
                { headers }
            );

            if (data.status === "SUCCESS") {
                setIsLoading(false);
                setIsSubmitted(true); // تحديث حالة الإرسال
                formik.resetForm(); // إعادة تعيين النموذج
                
                Swal.fire({
                    title: t('success'),
                    text: t('treatment_added_successfully'),
                    icon: 'success',
                    confirmButtonText: t('ok'),
                });
            }
        } catch (error) {
            setIsLoading(false);
            Swal.fire(t('error'), error.response?.data?.message || t('error_message'), 'error');
        }
    }

    const validationSchema = Yup.object({
        tagId: Yup.string().required(t('tag_id_required')),
        date: Yup.date().required(t('date_required')),
        treatments: Yup.array().of(
            Yup.object({
                treatmentId: Yup.string().required(t('treatment_required')),
                volume: Yup.number()
                    .required(t('volume_required'))
                    .positive(t('volume_positive'))
                    .typeError(t('volume_number')),
            })
        ).min(1, t('at_least_one_treatment')),
    });

    const formik = useFormik({
        initialValues: {
            tagId: "",
            treatments: [{ treatmentId: "", volume: "" }],
            date: "",
        },
        validationSchema,
        onSubmit: submitTreatment,
    });

    const addTreat = () => {
        if (!isSubmitted) { // لا تسمح بإضافة علاجات جديدة إذا تم الإرسال
            formik.setFieldValue('treatments', [
                ...formik.values.treatments,
                { treatmentId: '', volume: '' },
            ]);
        }
    };

    const handleTreatmentChange = (e, index) => {
        if (!isSubmitted) { // لا تسمح بتعديل البيانات إذا تم الإرسال
            const { name, value } = e.target;
            const updatedTreatments = [...formik.values.treatments];
            updatedTreatments[index][name] = name === 'volume' ? Number(value) : value;
            formik.setFieldValue('treatments', updatedTreatments);
        }
    };

    // دالة لإعادة تعيين النموذج والسماح بإدخال جديد
    const resetForm = () => {
        formik.resetForm({
            values: {
                tagId: "",
                treatments: [{ treatmentId: "", volume: "" }],
                date: "",
            }
        });
        setIsSubmitted(false);
    };

    return (
        <div className='container'>
            <div className="title2">{t('treatment_by_animal')}</div>
            {error && <p className="text-danger">{error}</p>}
            
            {isSubmitted && (
                <div className="alert alert-success mt-3">
                    {t('treatment_saved_successfully')}
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
                            disabled={isLoading || isSubmitted || !formik.isValid}
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
                        <label className="label" htmlFor="tagId">{t('tag_id')}</label>
                        <input
                            autoComplete="off"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.tagId}
                            id="tagId"
                            placeholder={t('enter_tag_id')}
                            type="text"
                            className="input2"
                            name="tagId"
                            disabled={isSubmitted}
                            aria-label={t('tag_id')}
                        />
                        {formik.errors.tagId && formik.touched.tagId && (
                            <p className="text-danger">{formik.errors.tagId}</p>
                        )}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="date">{t('date')}</label>
                        <input
                            autoComplete="off"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.date}
                            placeholder={t('enter_treatment_date')}
                            id="date"
                            type="date"
                            className="input2"
                            name="date"
                            disabled={isSubmitted}
                            aria-label={t('treatment_date')}
                        />
                        {formik.errors.date && formik.touched.date && (
                            <p className="text-danger">{formik.errors.date}</p>
                        )}
                    </div>

                    {formik.values.treatments.map((treatment, index) => (
                        <div key={index} className="input-box">
                            <div>
                                <label className="label" htmlFor={`treatmentName-${index}`}>
                                    {t('treatment_name')}
                                </label>
                                <select
                                    id={`treatmentName-${index}`}
                                    name="treatmentId"
                                    className="input2"
                                    value={treatment.treatmentId}
                                    onChange={(e) => handleTreatmentChange(e, index)}
                                    onBlur={formik.handleBlur}
                                    disabled={isSubmitted}
                                    aria-label={t('treatment_name')}
                                >
                                    <option value="">{t('select_treatment')}</option>
                                    {treatmentOptions.map((treatmentOption) => (
                                        <option key={treatmentOption._id} value={treatmentOption._id}>
                                            {treatmentOption.name}
                                        </option>
                                    ))}
                                </select>
                                {formik.errors.treatments?.[index]?.treatmentId && (
                                    <p className="text-danger">{formik.errors.treatments[index].treatmentId}</p>
                                )}
                            </div>

                            <div>
                                <label className="label" htmlFor={`volume-${index}`}>
                                    {t('volume')}
                                </label>
                                <input
                                    autoComplete="off"
                                    onBlur={formik.handleBlur}
                                    onChange={(e) => handleTreatmentChange(e, index)}
                                    value={treatment.volume}
                                    placeholder={t('enter_volume')}
                                    id={`volume-${index}`}
                                    type="number"
                                    className="input2"
                                    name="volume"
                                    disabled={isSubmitted}
                                    aria-label={t('treatment_volume')}
                                />
                                {formik.errors.treatments?.[index]?.volume && (
                                    <p className="text-danger">{formik.errors.treatments[index].volume}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                
                {!isSubmitted && (
                    <button 
                        type="button" 
                        onClick={addTreat} 
                        className="btn button2"
                        disabled={isSubmitted}
                    >
                        {t('add_treatment')} (+)
                    </button>
                )}
            </form>
        </div>
    );
}

export default TreatmentAnimal;