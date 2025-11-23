import { useFormik } from 'formik';
import  { useState } from 'react';
import { IoIosSave } from "react-icons/io";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import './Weight.css';

function Weight() {
    const { t } = useTranslation();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        return Authorization ? { Authorization: Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}` } : {};
    };

    async function submitWeight(value) {
        if (isSubmitted) return;

        const headers = getHeaders();
        setIsLoading(true);
        setError(null);
        try {
            let { data } = await axios.post(
                `https://api.mazraaonline.com/api/weight/AddWeight`,
                value,
                { headers }
            );
            if (data.status === "success") {
                setIsLoading(false);
                setIsSubmitted(true);
                Swal.fire({
                    title: t('success'),
                    text: t('weight_added_successfully'),
                    icon: 'success',
                    confirmButtonText: t('ok'),
                })
                formik.resetForm();
            }
        } catch (err) {
            setIsLoading(false);
            setError(err.response?.data?.message || t('error_occurred'));
        }
    }

  

    const formik = useFormik({
        initialValues: {
            tagId: '',
            weightType: '',
            weight: '',
            height: '',
            Date: '',
        },
        onSubmit: submitWeight,
    });

    return (
        <div className="weight-details-container">
            <div className="weight-details-header container">
                <h1>{t('weight')}</h1>
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
                                disabled={isSubmitted}
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
                                disabled={isSubmitted}
                            >
                                <option value="">{t('select_weight_type')}</option>
                                <option value="birth">{t('birth')}</option>
                                <option value="Weaning">{t('weaning')}</option>
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
                                disabled={isSubmitted}
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
                                disabled={isSubmitted}
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
                                disabled={isSubmitted}
                                max={new Date().toISOString().split('T')[0]}
                            />
                            {formik.errors.Date && formik.touched.Date && (
                                <p className="text-danger">{formik.errors.Date}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="save-button" 
                        disabled={isLoading || isSubmitted || !formik.isValid}
                    >
                        {isLoading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            <>
                                <IoIosSave /> {t('save')}
                            </>
                        )}
                    </button>
                </div>
{isSubmitted && (
  <button
    type="button"
    className="save-button"
    onClick={() => {
      formik.resetForm();
      setIsSubmitted(false);
    }}
  >
    {t("add_new_weight")}
  </button>
)}

            </form>
        </div>
    );
}

export default Weight;