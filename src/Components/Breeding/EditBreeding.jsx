import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { IoIosSave } from 'react-icons/io';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function EditBreeding() {
    const { id } = useParams();
    const { t } = useTranslation();
    const [showAlert, setShowAlert] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [birthEntries, setBirthEntries] = useState([{ tagId: '', gender: '', birthweight: '', expectedWeaningDate: '' }]);

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return { Authorization: formattedToken };
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
                console.log(data);
                setShowAlert(true);
                await fetchBreedingData();
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "An error occurred while processing your request";
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
            tagId: Yup.string().required(t('Tag ID is required')),
            deliveryState: Yup.string()
                .required(t('Delivery state is required'))
                .oneOf(['normal', 'difficult', 'assisted', 'caesarean'], t('Invalid delivery state')),
            deliveryDate: Yup.date().required(t('Delivery date is required')).typeError(t('Invalid date format')),
            numberOfBirths: Yup.number().required(t('Number of births is required')).min(1, t('At least 1')).max(4, t('No more than 4')),
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
        <div className="container">
            <div className="title2">{t('Edit Breeding')}</div>

            <form onSubmit={formik.handleSubmit} className="mt-5">
                {isLoading ? (
                    <button type="submit" className="btn button2" disabled>
                        <i className="fas fa-spinner fa-spin"></i>
                    </button>
                ) : (
                    <button type="submit" className="btn button2">
                        <IoIosSave /> {t('Save')}
                    </button>
                )}

                <div className="animaldata">
                    <div className="input-box">
                        <label className="label" htmlFor="tagId">{t('Tag ID')}</label>
                        <input
                            {...formik.getFieldProps('tagId')}
                            placeholder={t('Enter your Tag ID')}
                            id="tagId"
                            type="text"
                            className="input2"
                        />
                        {formik.touched.tagId && formik.errors.tagId && <p className="text-danger">{formik.errors.tagId}</p>}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="deliveryState">{t("Delivery State")}</label>
                        <select
                            id="deliveryState"
                            name="deliveryState"
                            className="input2"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.deliveryState}
                        >
                            <option value="">{t("Select delivery state")}</option>
                            <option value="normal">{t("Normal")}</option>
                            <option value="difficult">{t("Difficult")}</option>
                            <option value="assisted">{t("Assisted")}</option>
                            <option value="caesarean">{t("Caesarean")}</option>
                        </select>
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="deliveryDate">{t('Delivery Date')}</label>
                        <input
                            {...formik.getFieldProps('deliveryDate')}
                            placeholder={t('Enter your delivery date')}
                            id="deliveryDate"
                            type="date"
                            className="input2"
                        />
                        {formik.touched.deliveryDate && formik.errors.deliveryDate && <p className="text-danger">{formik.errors.deliveryDate}</p>}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="numberOfBirths">{t('Number of Births')}</label>
                        <input
                            value={formik.values.numberOfBirths}
                            onChange={handleNumberOfBirthsChange}
                            placeholder={t('Enter number of births')}
                            id="numberOfBirths"
                            type="number"
                            className="input2"
                            name="numberOfBirths"
                        />
                        {formik.touched.numberOfBirths && formik.errors.numberOfBirths && <p className="text-danger">{formik.errors.numberOfBirths}</p>}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="milking">{t("Milking")}</label>
                        <select
                            id="milking"
                            name="milking"
                            className="input2"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.milking}
                        >
                            <option value="">{t("Select milking")}</option>
                            <option value="no milk">{t("No Milk")}</option>
                            <option value="one teat">{t("One Teat")}</option>
                            <option value="two teat">{t("Two Teat")}</option>
                        </select>
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="motheringAbility">{t("Mothering Ability")}</label>
                        <select
                            id="motheringAbility"
                            name="motheringAbility"
                            className="input2"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.motheringAbility}
                        >
                            <option value="">{t("Select mothering ability")}</option>
                            <option value="good">{t("Good")}</option>
                            <option value="medium">{t("Medium")}</option>
                            <option value="bad">{t("Bad")}</option>
                        </select>
                    </div>

                    {birthEntries.map((entry, index) => (
                        <div key={`birth-entry-${index}`} className="input-box">
                            <label className="label" htmlFor={`birthEntries-${index}-tagId`}>{t('Calf Tag ID')} {index + 1}</label>
                            <input
                                value={entry.tagId}
                                onChange={(e) => handleBirthEntriesChange(e, index)}
                                placeholder={t('Enter Calf Tag ID')}
                                id={`birthEntries-${index}-tagId`}
                                name="tagId"
                                type="text"
                                className="input2"
                            />

                            <label className="label" htmlFor={`birthEntries-${index}-gender`}>{t('Gender')} {index + 1}</label>
                            <input
                                value={entry.gender}
                                onChange={(e) => handleBirthEntriesChange(e, index)}
                                placeholder={t('Enter Gender')}
                                id={`birthEntries-${index}-gender`}
                                name="gender"
                                type="text"
                                className="input2"
                            />

                            <label className="label" htmlFor={`birthEntries-${index}-birthweight`}>{t('Birthweight')} {index + 1}</label>
                            <input
                                value={entry.birthweight}
                                onChange={(e) => handleBirthEntriesChange(e, index)}
                                placeholder={t('Enter Birthweight')}
                                id={`birthEntries-${index}-birthweight`}
                                name="birthweight"
                                type="text"
                                className="input2"
                            />
                            <label className="label" htmlFor={`birthEntries-${index}-expectedWeaningDate`}>{t('Expected Weaning Date')} {index + 1}</label>
                            <input
                                value={entry.expectedWeaningDate}
                                onChange={(e) => handleBirthEntriesChange(e, index)}
                                placeholder={t('Enter Expected Weaning Date')}
                                id={`birthEntries-${index}-expectedWeaningDate`}
                                name="expectedWeaningDate"
                                type="date"
                                className="input2"
                            />
                        </div>
                    ))}
                </div>
            </form>
        </div>
    );
}
