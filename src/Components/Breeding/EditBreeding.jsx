import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { IoIosSave } from 'react-icons/io';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import './Breeding.css';

export default function EditBreeding() {
    const { id } = useParams();
    const { t } = useTranslation();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [birthEntries, setBirthEntries] = useState([{ tagId: '', gender: '', birthweight: '', expectedWeaningDate: '' }]);
    const navigate = useNavigate();

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        return Authorization ? { Authorization: Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}` } : {};
    };

    async function fetchBreedingData() {
        const headers = getHeaders();
        setIsLoading(true);
        try {
            const response = await axios.get(
                `https://farm-project-bbzj.onrender.com/api/breeding/GetSingleBreeding/${id}`,
                { headers }
            );

            const breedingData = response.data.data.breeding;

            if (breedingData) {
                formik.setValues({
                    tagId: breedingData.tagId || '',
                    deliveryState: breedingData.deliveryState || '',
                    deliveryDate: breedingData.deliveryDate ? breedingData.deliveryDate.split('T')[0] : '',
                    numberOfBirths: breedingData.birthEntries ? breedingData.birthEntries.length : 1,
                    milking: breedingData.milking || '',
                    motheringAbility: breedingData.motheringAbility || '',
                });

                setBirthEntries(breedingData.birthEntries.map(entry => ({
                    tagId: entry.tagId || '',
                    gender: entry.gender || '',
                    birthweight: entry.birthweight || '',
                    expectedWeaningDate: entry.expectedWeaningDate ? entry.expectedWeaningDate.split('T')[0] : ''
                })));
            }
        } catch (error) {
            setError("Failed to fetch breeding data.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchBreedingData();
    }, [id]);

    const editBreeding = async (values) => {
        const headers = getHeaders();
        setIsLoading(true);
        try {
            const dataToSubmit = {
                ...values,
                birthEntries,
            };
            const { data } = await axios.patch(
                `https://farm-project-bbzj.onrender.com/api/breeding/UpdateBreeding/${id}`,
                dataToSubmit,
                { headers }
            );
            if (data.status === "success") {
                Swal.fire({
                    title: t('success'),
                    text: t('breeding_updated_successfully'),
                    icon: 'success',
                    confirmButtonText: t('ok')
                }).then(() => {
                    navigate('/breadingTable');
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
            deliveryState: '',
            deliveryDate: '',
            milking: '',
            motheringAbility: '',
            numberOfBirths: 1,
        },
        validationSchema: Yup.object({
            tagId: Yup.string().required(t('tag_id_required')),
            deliveryState: Yup.string()
                .required(t('delivery_state_required'))
                .oneOf(['normal', 'difficult', 'assisted', 'caesarean'], t('invalid_delivery_state')),
            deliveryDate: Yup.date().required(t('delivery_date_required')),
            numberOfBirths: Yup.number().required(t('number_of_births_required')).min(1, t('min_births')).max(4, t('max_births')),
        }),
        onSubmit: (values) => editBreeding(values),
    });

    function handleNumberOfBirthsChange(e) {
        const newNumberOfBirths = parseInt(e.target.value, 10);
        if (newNumberOfBirths >= 1 && newNumberOfBirths <= 4) {
            setBirthEntries((prev) => {
                const newEntries = prev.slice(0, newNumberOfBirths);
                while (newEntries.length < newNumberOfBirths) {
                    newEntries.push({ tagId: '', gender: '', birthweight: '', expectedWeaningDate: '' });
                }
                return newEntries;
            });
        }
        formik.setFieldValue("numberOfBirths", newNumberOfBirths);
    }

    function handleBirthEntriesChange(e, index) {
        const { name, value } = e.target;
        setBirthEntries((prevEntries) => {
            return prevEntries.map((entry, i) =>
                i === index ? { ...entry, [name]: value } : entry
            );
        });
    }

    return (
        <div className="breeding-details-container">
            <div className="breeding-details-header">
                <h1>{t('edit_breeding')}</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={formik.handleSubmit} className="breeding-form">
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
                            <label htmlFor="deliveryState">{t('delivery_state')}</label>
                            <select
                                id="deliveryState"
                                name="deliveryState"
                                value={formik.values.deliveryState}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">{t('select_delivery_state')}</option>
                                <option value="normal">{t('normal')}</option>
                                <option value="difficult">{t('difficult')}</option>
                                <option value="assisted">{t('assisted')}</option>
                                <option value="caesarean">{t('caesarean')}</option>
                            </select>
                            {formik.errors.deliveryState && formik.touched.deliveryState && (
                                <p className="text-danger">{formik.errors.deliveryState}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="deliveryDate">{t('delivery_date')}</label>
                            <input
                                type="date"
                                id="deliveryDate"
                                name="deliveryDate"
                                value={formik.values.deliveryDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.deliveryDate && formik.touched.deliveryDate && (
                                <p className="text-danger">{formik.errors.deliveryDate}</p>
                            )}
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>{t('breeding_details')}</h2>
                        <div className="input-group">
                            <label htmlFor="milking">{t('milking')}</label>
                            <select
                                id="milking"
                                name="milking"
                                value={formik.values.milking}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">{t('select_milking')}</option>
                                <option value="no milk">{t('no_milk')}</option>
                                <option value="one teat">{t('one_teat')}</option>
                                <option value="two teat">{t('two_teat')}</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label htmlFor="motheringAbility">{t('mothering_ability')}</label>
                            <select
                                id="motheringAbility"
                                name="motheringAbility"
                                value={formik.values.motheringAbility}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="good">{t('good')}</option>
                                <option value="medium">{t('medium')}</option>
                                <option value="bad">{t('bad')}</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label htmlFor="numberOfBirths">{t('number_of_births')}</label>
                            <input
                                type="number"
                                id="numberOfBirths"
                                name="numberOfBirths"
                                value={formik.values.numberOfBirths}
                                onChange={handleNumberOfBirthsChange}
                                min="1"
                                max="4"
                            />
                            {formik.errors.numberOfBirths && formik.touched.numberOfBirths && (
                                <p className="text-danger">{formik.errors.numberOfBirths}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2>{t('birth_entries')}</h2>
                    {birthEntries.map((entry, index) => (
                        <div key={index} className="birth-entry-card">
                            <h3>{t('calf')} {index + 1}</h3>
                            <div className="input-group">
                                <label htmlFor={`tagId-${index}`}>{t('calf_tag_id')}</label>
                                <input
                                    type="text"
                                    id={`tagId-${index}`}
                                    name="tagId"
                                    value={entry.tagId}
                                    onChange={(e) => handleBirthEntriesChange(e, index)}
                                    placeholder={t('enter_calf_tag_id')}
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor={`gender-${index}`}>{t('gender')}</label>
                                <select
                                    id={`gender-${index}`}
                                    name="gender"
                                    value={entry.gender}
                                    onChange={(e) => handleBirthEntriesChange(e, index)}
                                >
                                    <option value="male">{t('male')}</option>
                                    <option value="female">{t('female')}</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label htmlFor={`birthweight-${index}`}>{t('birth_weight')}</label>
                                <input
                                    type="number"
                                    id={`birthweight-${index}`}
                                    name="birthweight"
                                    value={entry.birthweight}
                                    onChange={(e) => handleBirthEntriesChange(e, index)}
                                    placeholder={t('enter_birth_weight')}
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor={`expectedWeaningDate-${index}`}>{t('expected_weaning_date')}</label>
                                <input
                                    type="date"
                                    id={`expectedWeaningDate-${index}`}
                                    name="expectedWeaningDate"
                                    value={entry.expectedWeaningDate}
                                    onChange={(e) => handleBirthEntriesChange(e, index)}
                                />
                            </div>
                        </div>
                    ))}
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
