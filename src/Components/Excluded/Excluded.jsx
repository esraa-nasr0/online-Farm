import axiosInstance from '../../api/axios';
import { useFormik } from 'formik';
import { useState } from 'react';
import { IoIosSave } from "react-icons/io";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import './Excluded.css';

function Excluded() {
    const { t } = useTranslation(); 
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    async function submitExcluded(values) {
        setIsLoading(true);
        try {
            const { data } = await axiosInstance.post(
                '/excluded/addexcluded',
                values
            );
            if (data.status === "success") {
                setIsSubmitted(true);
                Swal.fire({
                    title: t('success'),
                    text: t('data_submitted'),
                    icon: "success",
                    confirmButtonText: t('ok'),
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || t('submit_error'));
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

    const formik = useFormik({
        initialValues: {
            tagId: '',
            Date: '', // ⚠️ غيرها لـ date لو الـ API بيستقبل كده
            weight: '',
            excludedType: '',
            price: '',
            reasoneOfDeath: '' // ⚠️ غيرها لـ reasonOfDeath لو API بيستقبل كده
        },
        onSubmit: submitExcluded
    });

    return (
        <div className="excluded-details-container">
            <div className="excluded-details-header container">
                <h1>{t('add_excluded')}</h1>
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
                            <>
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
                            </>
                        )}

                        {formik.values.excludedType === 'death'  && (
                            <div className="input-group">
                                <label htmlFor="reasoneOfDeath">{t('Reason')}</label>
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

                        {formik.values.excludedType === 'sweep' &&(
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

                    {isSubmitted && (
                        <button
                            type="button"
                            className="save-button"
                            onClick={() => {
                                formik.resetForm();
                                setIsSubmitted(false);
                            }}
                        >
                            {t('add_new_excluded')}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default Excluded;
