import axios from 'axios';
import { useFormik } from 'formik';
import React, { useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { IoIosSave } from "react-icons/io";
import * as Yup from 'yup';
import { TreatmentContext } from '../../Context/TreatmentContext';
import { useTranslation } from 'react-i18next';
import './Treatment.css';

function TreatmentAnimal() {
    const { t } = useTranslation();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [treatmentOptions, setTreatmentOptions] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
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
        if (isSubmitted) return;

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
                setIsSubmitted(true);
                formik.resetForm();
                
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

    // const validationSchema = Yup.object({
    //     tagId: Yup.string().required(t('tag_id_required')),
    //     date: Yup.date().required(t('date_required')),
    //     treatments: Yup.array().of(
    //         Yup.object({
    //             treatmentId: Yup.string().required(t('treatment_required')),
    //             volume: Yup.number()
    //                 .required(t('volume_required'))
    //                 .positive(t('volume_positive'))
    //                 .typeError(t('volume_number')),
    //         })
    //     ).min(1, t('at_least_one_treatment')),
    // });

    const formik = useFormik({
        initialValues: {
            tagId: "",
            treatments: [{ treatmentId: "", volume: "" }],
            date: "",
        },
        // validationSchema,
        onSubmit: submitTreatment,
    });

    const addTreat = () => {
        if (!isSubmitted) {
            formik.setFieldValue('treatments', [
                ...formik.values.treatments,
                { treatmentId: '', volume: '' },
            ]);
        }
    };

    const handleTreatmentChange = (e, index) => {
        if (!isSubmitted) {
            const { name, value } = e.target;
            const updatedTreatments = [...formik.values.treatments];
            updatedTreatments[index][name] = name === 'volume' ? Number(value) : value;
            formik.setFieldValue('treatments', updatedTreatments);
        }
    };

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
        <div className="treatment-container">
            <div className="treatment-header">
                <h1>{t('treatment_by_animal')}</h1>
            </div>

            {error && <div className="error-message">{error}</div>}
            
            {isSubmitted && (
                <div className="success-message">
                    <h3>{t('treatment_saved_successfully')}</h3>
                </div>
            )}

            <form onSubmit={formik.handleSubmit} className="treatment-form">
                <div className="form-grid">
                    <div className="form-section">
                        <h2>{t('animal_details')}</h2>
                        <div className="input-group">
                            <label htmlFor="tagId">{t('tag_id')}</label>
                            <input
                                id="tagId"
                                type="text"
                                {...formik.getFieldProps('tagId')}
                                disabled={isSubmitted}
                                placeholder={t('enter_tag_id')}
                            />
                            {formik.errors.tagId && formik.touched.tagId && (
                                <p className="error-message">{formik.errors.tagId}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="date">{t('date')}</label>
                            <input
                                id="date"
                                type="date"
                                {...formik.getFieldProps('date')}
                                disabled={isSubmitted}
                            />
                            {formik.errors.date && formik.touched.date && (
                                <p className="error-message">{formik.errors.date}</p>
                            )}
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>{t('treatments')}</h2>
                        {formik.values.treatments.map((treatment, index) => (
                            <div key={index} className="input-group">
                                <label htmlFor={`treatment-${index}`}>{t('treatment_name')}</label>
                                <select
                                    id={`treatment-${index}`}
                                    name="treatmentId"
                                    value={treatment.treatmentId}
                                    onChange={(e) => handleTreatmentChange(e, index)}
                                    disabled={isSubmitted}
                                >
                                    <option value="">{t('select_treatment')}</option>
                                    {treatmentOptions.map((option) => (
                                        <option key={option._id} value={option._id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                                {formik.errors.treatments?.[index]?.treatmentId && (
                                    <p className="error-message">{formik.errors.treatments[index].treatmentId}</p>
                                )}

                                <label htmlFor={`volume-${index}`}>{t('volume')}</label>
                                <input
                                    type="number"
                                    id={`volume-${index}`}
                                    name="volume"
                                    value={treatment.volume}
                                    onChange={(e) => handleTreatmentChange(e, index)}
                                    disabled={isSubmitted}
                                    placeholder={t('enter_volume')}
                                />
                                {formik.errors.treatments?.[index]?.volume && (
                                    <p className="error-message">{formik.errors.treatments[index].volume}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-actions">
                    {!isSubmitted && (
                        <button 
                            type="button" 
                            onClick={addTreat} 
                            className="add-treatment-button"
                            disabled={isSubmitted}
                        >
                            +
                        </button>
                    )}

                    {isLoading ? (
                        <button type="submit" className="save-button" disabled>
                            <span className="loading-spinner"></span>
                        </button>
                    ) : (
                        <button 
                            type="submit" 
                            className="save-button"
                            disabled={isLoading || isSubmitted || !formik.isValid}
                        >
                            <IoIosSave /> {t('save')}
                        </button>
                    )}

                    {isSubmitted && (
                        <button 
                            type="button" 
                            className="save-button"
                            onClick={resetForm}
                        >
                            {t('add_new_treatment')}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default TreatmentAnimal;