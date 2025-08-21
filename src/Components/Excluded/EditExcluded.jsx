import  { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { IoIosSave } from 'react-icons/io';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import './Excluded.css';

export default function EditExcluded() {
    const { id } = useParams();
    const { t } = useTranslation();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        return Authorization ? { Authorization: Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}` } : {};
    };

    async function fetchExcludedData() {
        const headers = getHeaders();
        setIsLoading(true);
        try {
            const response = await axios.get(
                `https://farm-project-bbzj.onrender.com/api/excluded/getSingleExcludeds/${id}`,
                { headers }
            );
            const excludedData = response.data.data.excluded;
            if (excludedData) {
                formik.setValues({
                    tagId: excludedData.tagId || '',
                    excludedType: excludedData.excludedType || '',
                    price: excludedData.price || '',
                    weight: excludedData.weight || '',
                    Date: excludedData.Date ? excludedData.Date.split('T')[0] : '',
                    reasoneOfDeath: excludedData.reasoneOfDeath || ''
                });
            }
        } catch (error) {
            setError("Failed to fetch excluded data.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchExcludedData();
    }, [id]);

    const editExcluded = async (values) => {
        const headers = getHeaders();
        setIsLoading(true);
        try {
            const { data } = await axios.patch(
                `https://farm-project-bbzj.onrender.com/api/excluded/updateexcluded/${id}`,
                values,
                { headers }
            );
            if (data.status === "success") {
                Swal.fire({
                    title: t('success'),
                    text: t('excluded_updated_successfully'),
                    icon: 'success',
                    confirmButtonText: t('ok')
                }).then(() => {
                    navigate('/excludedtable');
                });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || t('error_occurred');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            tagId: '',
            excludedType: '',
            price: '',
            weight: '',
            Date: '',
            reasoneOfDeath: ''
        },
        validationSchema: Yup.object({
            tagId: Yup.string().required(t('tag_id_required')),
            excludedType: Yup.string().required(t('excluded_type_required')),
            price: Yup.string().when('excludedType', {
                is: 'sale',
                then: (schema) => schema.required(t('price_required'))
            }),
            weight: Yup.string().required(t('weight_required')),
            Date: Yup.date().required(t('date_required')),
            reasoneOfDeath: Yup.string().when('excludedType', {
                is: (type) => type === 'death' || type === 'sweep',
                then: (schema) => schema.required(t('reason_required'))
            })
        }),
        onSubmit: (values) => editExcluded(values),
    });

    return (
        <div className="excluded-details-container">
            <div className="excluded-details-header container">
                <h1>{t('edit_excluded')}</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={formik.handleSubmit} className="excluded-form container">
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
                            <label htmlFor="weight">{t('weight')}</label>
                            <input
                                type="number"
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
                            <label htmlFor="Date">{t('date')}</label>
                            <input
                                type="date"
                                id="Date"
                                name="Date"
                                value={formik.values.Date}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.Date && formik.touched.Date && (
                                <p className="text-danger">{formik.errors.Date}</p>
                            )}
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>{t('exclusion_details')}</h2>
                        <div className="input-group">
                            <label htmlFor="excludedType">{t('excluded_type')}</label>
                            <select
                                id="excludedType"
                                name="excludedType"
                                value={formik.values.excludedType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">{t('select_excluded_type')}</option>
                                <option value="sale">{t('sale')}</option>
                                <option value="death">{t('death')}</option>
                                <option value="sweep">{t('sweep')}</option>
                            </select>
                            {formik.errors.excludedType && formik.touched.excludedType && (
                                <p className="text-danger">{formik.errors.excludedType}</p>
                            )}
                        </div>

                        {formik.values.excludedType === 'sale' && (
                            <div className="input-group">
                                <label htmlFor="price">{t('price')}</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder={t('enter_price')}
                                />
                                {formik.errors.price && formik.touched.price && (
                                    <p className="text-danger">{formik.errors.price}</p>
                                )}
                            </div>
                        )}

                        {(formik.values.excludedType === 'death' || formik.values.excludedType === 'sweep') && (
                            <div className="input-group">
                                <label htmlFor="reasoneOfDeath">{t('reason')}</label>
                                <input
                                    type="text"
                                    id="reasoneOfDeath"
                                    name="reasoneOfDeath"
                                    value={formik.values.reasoneOfDeath}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder={t('enter_reason')}
                                />
                                {formik.errors.reasoneOfDeath && formik.touched.reasoneOfDeath && (
                                    <p className="text-danger">{formik.errors.reasoneOfDeath}</p>
                                )}
                            </div>
                        )}
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
