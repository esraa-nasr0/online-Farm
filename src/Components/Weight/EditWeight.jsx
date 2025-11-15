import { useFormik } from 'formik';
import  { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { IoIosSave } from 'react-icons/io';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import './Weight.css';

function EditWeight() {
    const { t } = useTranslation();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();
    let navigate = useNavigate();

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        return Authorization ? { Authorization: Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}` } : {};
    };

    async function editWeight(values) {
        const headers = getHeaders();
        setIsLoading(true);
        try {
            const convertToISO = (dateString) => {
                if (dateString && !isNaN(new Date(dateString))) {
                    return new Date(dateString).toISOString();
                }
                return null;
            };
            const updatedValues = {
                ...values,
                Date: convertToISO(values.Date),
            };
            let { data } = await axios.patch(
                `https://farm-project-bbzj.onrender.com/api/weight/updateweight/${id}`,
                updatedValues,
                { headers }
            );
            console.log('Submitting form with values:', updatedValues);

            if (data.status === "success") {
                setIsLoading(false);
                Swal.fire({
                    title: t('success'),
                    text: t('weight_updated_successfully'),
                    icon: 'success',
                    confirmButtonText: t('ok')
                }).then(() => {
                    navigate('/weightTable');
                });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "An error occurred while processing your request";
            setError(errorMessage);
            console.log(err.response?.data);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        async function fetchAnimal() {
            const headers = getHeaders();
            try {
                let { data } = await axios.get(
                    `https://farm-project-bbzj.onrender.com/api/weight/GetSingleWeight/${id}`,
                    { headers }
                );
                console.log("API response:", data);
                if (data && data.data && data.data.weight) {
                    const weight = data.data.weight;
                    const formatDate = (dateString) => dateString ? new Date(dateString).toISOString().split('T')[0] : '';
                    formik.setValues({
                        tagId: weight.tagId || '',
                        weightType: weight.weightType || '',
                        weight: weight.weight || '',
                        Date: formatDate(weight.Date),
                        height: weight.height || '',
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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const validationSchema = Yup.object({
        tagId: Yup.string().max(10, t('tag_id_max')).required(t('tag_id_required')),
        weightType: Yup.string().required(t('weight_type_required')),
        weight: Yup.number()
            .max(1000, t('weight_max'))
            .positive(t('weight_positive'))
            .required(t('weight_required')),
        height: Yup.number()
            .max(300, t('height_max'))
            .positive(t('height_positive'))
            .required(t('height_required')),
        Date: Yup.date()
            .required(t('date_required'))
            .max(new Date(), t('date_cannot_be_future')),
    });


    const formik = useFormik({
        initialValues: {
            tagId: '',
            weightType: '',
            weight: '',
            height: '',
            Date: '',
        },
        validationSchema,
        onSubmit: editWeight,
    });

    return (
        <div className="weight-details-container">
            <div className="weight-details-header container">
                <h1>{t('edit_weight')}</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={formik.handleSubmit} className="weight-form container">
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
                            <label htmlFor="weightType">{t('weight_type')}</label>
                            <select
                                id="weightType"
                                name="weightType"
                                value={formik.values.weightType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">{t('select_weight_type')}</option>
                                <option value="birth">{t('birth')}</option>
                                <option value="weaning">{t('weaning')}</option>
                                <option value="regular">{t('regular')}</option>
                            </select>
                            {formik.errors.weightType && formik.touched.weightType && (
                                <p className="text-danger">{formik.errors.weightType}</p>
                            )}
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>{t('measurements')}</h2>
                        <div className="input-group">
                            <label htmlFor="weight">{t('weight')} (kg)</label>
                            <input
                                type="number"
                                step="0.01"
                                id="weight"
                                name="weight"
                                value={formik.values.weight}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder={t('enter_weight')}
                            />
                            {formik.errors.weight && formik.touched.weight && (
                                <p className="text-danger">{formik.errors.weight}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="height">{t('height')} (cm)</label>
                            <input
                                type="number"
                                step="0.1"
                                id="height"
                                name="height"
                                value={formik.values.height}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder={t('enter_height')}
                            />
                            {formik.errors.height && formik.touched.height && (
                                <p className="text-danger">{formik.errors.height}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="Date">{t('date')}</label>
                            <input
                                type="date"
                                id="Date"
                                name="Date"
                                value={formik.values.Date}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                max={new Date().toISOString().split('T')[0]}
                            />
                            {formik.errors.Date && formik.touched.Date && (
                                <p className="text-danger">{formik.errors.Date}</p>
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

export default EditWeight;
