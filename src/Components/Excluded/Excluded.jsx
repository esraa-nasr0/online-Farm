import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { IoIosSave } from "react-icons/io";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function Excluded() {
    const { t } = useTranslation();  // useTranslation hook
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const [matingData, setMatingData] = useState(null);

    // Helper function to generate headers with the latest token
    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return { Authorization: formattedToken };
    };

    async function submitMating(value) {
        const headers = getHeaders(); // Get the latest headers
        setisLoading(true);
        try {
            let { data } = await axios.post(
                `https://farm-project-bbzj.onrender.com/api/excluded/addexcluded`,
                value,
                { headers }
            );
            if (data.status === "success") {
                Swal.fire({
                    title: t('success'),
                    text: t('data_submitted'),
                    icon: "success",
                    confirmButtonText: t('ok'),
                }).then(() => navigate('/exclutedtable'));
            }
        } catch (err) {
            Swal.fire({
                title: t('error'),
                text: err.response?.data?.message || t('submit_error'),
                icon: "error",
                confirmButtonText: t('ok'),
            });
        } finally {
            setisLoading(false);
        }
    }

    let formik = useFormik({
        initialValues: {
            tagId: '',
            Date: '',
            weight: '',
            excludedType: '',
            price: '',
            reasoneOfDeath: ''
        },
        onSubmit: submitMating
    });

    return (
        <>
            <div className="container">

            


                <div className="title2">{t('add_excluded')}</div>


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
                        <button type="submit" className="btn button2">
                            <IoIosSave /> {t('save')}
                        </button>
                    )}

                    <div className="animaldata">
                        <div className="input-box">
                            <label className="label" htmlFor="weight">{t('weight')}</label>
                            <input
                                value={formik.values.weight}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="input2"
                                name="weight"
                                id="weight"
                                placeholder={t('weight_placeholder')}
                            />
                            {formik.errors.weight && formik.touched.weight && (
                                <p className="text-danger">{formik.errors.weight}</p>
                            )}
                        </div>

                        <div className="input-box">
                            <label className="label" htmlFor="tagId">{t('tag_id')}</label>
                            <input
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.tagId}
                                placeholder={t('tag_id_placeholder')}
                                id="tagId"
                                type="text"
                                className="input2"
                                name="tagId"
                            />
                            {formik.errors.tagId && formik.touched.tagId && (
                                <p className="text-danger">{formik.errors.tagId}</p>
                            )}
                        </div>

                        <div className="input-box">
                            <label className="label" htmlFor="Date">{t('date')}</label>
                            <input
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.Date}
                                id="Date"
                                type="date"
                                className="input2"
                                name="Date"
                            />
                            {formik.errors.Date && formik.touched.Date && (
                                <p className="text-danger">{formik.errors.Date}</p>
                            )}
                        </div>

                        <div className="input-box">
                            <label className="label" htmlFor="excludedType">{t('excluded_type')}</label>
                            <select
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.excludedType}
                                id="excludedType"
                                className="input2"
                                name="excludedType"
                            >
                                <option value="" disabled hidden>{t('choose_excluded_type')}</option>
                                <option value="sale">{t('sale')}</option>
                                <option value="death">{t('death')}</option>
                                <option value="sweep">{t('sweep')}</option>
                            </select>

                            {formik.values.excludedType === 'sale' && (
                                <div className="input-box">
                                    <label className="label" htmlFor="price">{t('price')}</label>
                                    <input
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={formik.values.price}
                                        placeholder={t('enter_price')}
                                        id="price"
                                        type="text"
                                        className="input2"
                                        name="price"
                                    />
                                    {formik.errors.price && formik.touched.price && (
                                        <p className="text-danger">{formik.errors.price}</p>
                                    )}
                                </div>
                            )}

                            {formik.values.excludedType === 'death' && (
                                <div className="input-box">
                                    <label className="label" htmlFor="reasoneOfDeath">{t('reason_of_death')}</label>
                                    <input
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={formik.values.reasoneOfDeath}
                                        id="reasoneOfDeath"
                                        type="text"
                                        className="input2"
                                        name="reasoneOfDeath"
                                    />
                                    {formik.errors.reasoneOfDeath && formik.touched.reasoneOfDeath && (
                                        <p className="text-danger">{formik.errors.reasoneOfDeath}</p>
                                    )}
                                </div>
                            )}

                            {formik.values.excludedType === 'sweep' && (
                                <div className="input-box">
                                    <label className="label" htmlFor="reasoneOfDeath">{t('reason_of_sweep')}</label>
                                    <input
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={formik.values.reasoneOfDeath}
                                        id="reasoneOfDeath"
                                        type="text"
                                        className="input2"
                                        name="reasoneOfDeath"
                                    />
                                    {formik.errors.reasoneOfDeath && formik.touched.reasoneOfDeath && (
                                        <p className="text-danger">{formik.errors.reasoneOfDeath}</p>
                                    )}
                                </div>
                            )}

                            {formik.errors.excludedType && formik.touched.excludedType && (
                                <p className="text-danger">{formik.errors.excludedType}</p>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Excluded;
