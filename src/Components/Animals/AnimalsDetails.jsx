import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { IoIosSave } from "react-icons/io";
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import { LocationContext } from '../../Context/LocationContext';
import { BreedContext } from '../../Context/BreedContext';
import './AnimalsDetails.css';

function AnimalsDetails() {
    const { t } = useTranslation();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [responseData, setResponseData] = useState(null);
    const [locationSheds, setLocationSheds] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { LocationMenue } = useContext(LocationContext);
    const { BreedMenue } = useContext(BreedContext);

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        return Authorization ? { Authorization: Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}` } : {};
    };

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const { data } = await LocationMenue();
                if (data.status === 'success' && Array.isArray(data.data.locationSheds)) {
                    setLocationSheds(data.data.locationSheds);
                }
            } catch {
                setError('Failed to load location sheds');
            }
        };
        fetchLocation();
    }, [LocationMenue]);

    useEffect(() => {
        const fetchBreed = async () => {
            try {
                const { data } = await BreedMenue();
                if (data.status === 'success' && Array.isArray(data.data.breeds)) {
                    setBreeds(data.data.breeds);
                }
            } catch {
                setError('Failed to load breeds data');
            }
        };
        fetchBreed();
    }, [BreedMenue]);

    const postAnimal = async (values) => {
        if (isSubmitted) return;

        const headers = getHeaders();
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await axios.post(
                'https://farm-project-bbzj.onrender.com/api/animal/addanimal',
                values,
                { headers },
            );
            
            if (data.status === "success") {
                setResponseData(data.data.animal);
                setIsSubmitted(true);
                Swal.fire({
                    title: t('success_title'),
                    text: t('animal_add_success'),
                    icon: 'success',
                    confirmButtonText: t('ok'),
                });
                formik.resetForm();
            }
        } catch (err) {
            setError(err.response?.data?.message || t('error_message'));
            console.error('Submission error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            tagId: '',
            animalType: '',
            breed: '',
            gender: '',
            motherId: '',
            fatherId: '',
            birthDate: '',
            locationShedName: '',
            female_Condition: '',
            animaleCondation: '',
            traderName: '',
            purchaseDate: '',
            purchasePrice: '',
            teething: '',
        },
        onSubmit: postAnimal
    });

    return (
        <div className="animal-details-container">
            <div className="animal-details-header">
                <h1>{t('add_animal')}</h1>
                
            </div>

            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={formik.handleSubmit} className="animal-form">
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
                                disabled={isSubmitted}
                                placeholder={t('enter_tag_id')}
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="breed">{t('breed')}</label>
                            <select
                                id="breed"
                                name="breed"
                                value={formik.values.breed}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={isSubmitted}
                            >
                                <option value="">{t('select_breed')}</option>
                                {breeds.map((breed) => (
                                    <option key={breed._id} value={breed.breedName}>
                                        {breed.breedName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label htmlFor="locationShedName">{t('location_shed')}</label>
                            <select
                                id="locationShedName"
                                name="locationShedName"
                                value={formik.values.locationShedName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={isSubmitted}
                            >
                                <option value="">{t('select_location_shed')}</option>
                                {locationSheds.map((shed) => (
                                    <option key={shed._id} value={shed.locationShedName}>
                                        {shed.locationShedName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>{t('animal_details')}</h2>
                        <div className="input-group">
                            <label htmlFor="animalType">{t('animal_type')}</label>
                            <select
                                id="animalType"
                                name="animalType"
                                value={formik.values.animalType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={isSubmitted}
                            >
                                <option value="">{t('select_animal_type')}</option>
                                <option value="goat">{t('goat')}</option>
                                <option value="sheep">{t('sheep')}</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label htmlFor="gender">{t('gender')}</label>
                            <select
                                id="gender"
                                name="gender"
                                value={formik.values.gender}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={isSubmitted}
                            >
                                <option value="">{t('select_gender')}</option>
                                <option value="female">{t('female')}</option>
                                <option value="male">{t('male')}</option>
                            </select>
                        </div>

                        {formik.values.gender === 'female' && (
                            <div className="input-group">
                                <label htmlFor="female_Condition">{t('female_condition')}</label>
                                <input
                                    type="text"
                                    id="female_Condition"
                                    name="female_Condition"
                                    value={formik.values.female_Condition}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={isSubmitted}
                                    placeholder={t('enter_female_condition')}
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-section">
                        <h2>{t('acquisition_details')}</h2>
                        <div className="input-group">
                            <label htmlFor="animaleCondation">{t('animal_condition')}</label>
                            <select
                                id="animaleCondation"
                                name="animaleCondation"
                                value={formik.values.animaleCondation}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={isSubmitted}
                            >
                                <option value="">{t('select_condition')}</option>
                                <option value="purchase">{t('purchase')}</option>
                                <option value="born at farm">{t('born_at_farm')}</option>
                            </select>
                        </div>

                        {formik.values.animaleCondation === 'purchase' ? (
                            <>
                                <div className="input-group">
                                    <label htmlFor="traderName">{t('trader_name')}</label>
                                    <input
                                        type="text"
                                        id="traderName"
                                        name="traderName"
                                        value={formik.values.traderName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={isSubmitted}
                                        placeholder={t('enter_trader_name')}
                                    />
                                </div>

                                <div className="input-group">
                                    <label htmlFor="purchaseDate">{t('purchase_date')}</label>
                                    <input
                                        type="date"
                                        id="purchaseDate"
                                        name="purchaseDate"
                                        value={formik.values.purchaseDate}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={isSubmitted}
                                    />
                                </div>

                                <div className="input-group">
                                    <label htmlFor="purchasePrice">{t('purchase_price')}</label>
                                    <input
                                        type="number"
                                        id="purchasePrice"
                                        name="purchasePrice"
                                        value={formik.values.purchasePrice}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={isSubmitted}
                                        placeholder={t('enter_purchase_price')}
                                    />
                                </div>

                                <div className="input-group">
                                    <label htmlFor="teething">{t('teething')}</label>
                                    <select
                                        id="teething"
                                        name="teething"
                                        value={formik.values.teething}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={isSubmitted}
                                    >
                                        <option value="">{t('select_teething')}</option>
                                        <option value="two">{t('two')}</option>
                                        <option value="four">{t('four')}</option>
                                        <option value="six">{t('six')}</option>
                                    </select>
                                </div>
                            </>
                        ) : formik.values.animaleCondation === 'born at farm' && (
                            <>
                                <div className="input-group">
                                    <label htmlFor="motherId">{t('mother_id')}</label>
                                    <input
                                        type="text"
                                        id="motherId"
                                        name="motherId"
                                        value={formik.values.motherId}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={isSubmitted}
                                        placeholder={t('enter_mother_id')}
                                    />
                                </div>

                                <div className="input-group">
                                    <label htmlFor="fatherId">{t('father_id')}</label>
                                    <input
                                        type="text"
                                        id="fatherId"
                                        name="fatherId"
                                        value={formik.values.fatherId}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={isSubmitted}
                                        placeholder={t('enter_father_id')}
                                    />
                                </div>

                                <div className="input-group">
                                    <label htmlFor="birthDate">{t('birth_date')}</label>
                                    <input
                                        type="date"
                                        id="birthDate"
                                        name="birthDate"
                                        value={formik.values.birthDate}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={isSubmitted}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="save-button" disabled={isLoading || isSubmitted}>
                        {isLoading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            <>
                                <IoIosSave /> {t('save')}
                            </>
                        )}
                    </button>
                </div>

                {responseData && (
                    <div className="success-message">
                        <h3>{t('animal_details')}</h3>
                        <p>{t('age_in_days')}: {responseData.ageInDays}</p>
                    </div>
                )}
            </form>
        </div>
    );
}

export default AnimalsDetails;