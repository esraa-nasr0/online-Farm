import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { IoIosSave } from "react-icons/io";
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import { LocationContext } from '../../Context/LocationContext';
import { BreedContext } from '../../Context/BreedContext';
import { jwtDecode } from 'jwt-decode';
import './AnimalsDetails.css';

function EditAnimal() {
    const { t } = useTranslation();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [animalData, setAnimalData] = useState(null);
    const [locationSheds, setLocationSheds] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [isFattening, setIsFattening] = useState(false);
    const { LocationMenue } = useContext(LocationContext);
    const { BreedMenue } = useContext(BreedContext);
    const { id } = useParams();

    useEffect(() => {
        const token = localStorage.getItem('Authorization');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setIsFattening(decoded.registerationType === 'fattening');
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

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

    async function editAnimal(values) {
        const headers = getHeaders();
        setIsLoading(true);
        try {
            const convertToISO = (dateString) => {
                if (!dateString) return undefined;
                const date = new Date(dateString);
                return isNaN(date) ? undefined : date.toISOString();
            };

            const updatedValues = {
                ...values,
                birthDate: convertToISO(values.birthDate),
                purchaseDate: convertToISO(values.purchaseDate),
            };
            const payload = Object.fromEntries(
                Object.entries(updatedValues).filter(([_, v]) => v !== undefined)
            );
            console.log('Submitting form with values:', payload);
            let { data } = await axios.patch(
                `https://farm-project-bbzj.onrender.com//api/animal/updateanimal/${id}`,
                payload,
                { headers }
            );

            if (data.status === "success") {
                setIsLoading(false);
                setAnimalData(data.data.animal);
                Swal.fire({
                    title: t('success_title'),
                    text: t('animal_update_success'),
                    icon: 'success',
                    confirmButtonText: t('ok')
                });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "An error occurred while processing your request";
            setError(errorMessage);
            console.log(err.response?.data);
            setIsLoading(false);
        }
    }

    async function fetchAnimal() {
    const headers = getHeaders();
    try {
        let { data } = await axios.get(
            `https://farm-project-bbzj.onrender.com/api/animal/getsinglanimals/${id}`,
            { headers }
        );

        if (data.status === "success") {
            const animal = data.data.animal;
            console.log("Full animal data:", animal); // عرض كل البيانات في الكونسول
            
            const formatDate = (dateString) => dateString ? new Date(dateString).toISOString().split('T')[0] : '';
            
            // تعبئة كل الحقول في الفورم
            formik.setValues({
                tagId: animal.tagId || '',
                animalType: animal.animalType || '',
                breed: animal.breed?._id || animal.breed || '', // تعديل هنا لاستقبال كائن breed
                gender: animal.gender || '',
                motherId: animal.motherId || '',
                fatherId: animal.fatherId || '',
                birthDate: formatDate(animal.birthDate),
                locationShedName: animal.locationShed?._id || animal.locationShed || '', // تعديل هنا
                female_Condition: animal.female_Condition || '',
                animaleCondation: animal.animaleCondation || '',
                traderName: animal.traderName || '',
                purchaseDate: formatDate(animal.purchaseDate),
                purchasePrice: animal.purchasePrice || '',
                teething: animal.teething || '',
            });
            
            // حفظ كل بيانات الحيوان في state لعرضها
            setAnimalData(animal);
        } else {
            throw new Error(data.message || "Failed to fetch animal");
        }
    } catch (error) {
        console.error("Error fetching animal:", error);
        setError(error.response?.data?.message || "Failed to load animal data");
    }
}

useEffect(() => {
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
        setError("Invalid animal ID");
        return;
    }
    fetchAnimal();
}, [id]);

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
        onSubmit: (values) => editAnimal(values),
    });

    return (
        <div className="animal-details-container">
            <div className="animal-details-header">
                <h1>{t('edit_animal')}</h1>
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
                            >
                                <option value="">{t('select_breed')}</option>
                                {breeds.map((breed) => (
                                    <option key={breed._id} value={breed._id}>
                                        {breed.breedName}
                                    </option>
                                ))}
                            </select>
                            {animalData?.breed && (
                                <div className="current-value">
                                    القيمة الحالية: {animalData.breed.breedName}
                                </div>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="locationShedName">{t('location_shed')}</label>
                            <select
                                id="locationShedName"
                                name="locationShedName"
                                value={formik.values.locationShedName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">{t('select_location_shed')}</option>
                                {locationSheds.map((shed) => (
                                    <option key={shed._id} value={shed._id}>
                                        {shed.locationShedName}
                                    </option>
                                ))}
                            </select>
                            {animalData?.locationShed && (
                                <div className="current-value">
                                    القيمة الحالية: {animalData.locationShed.locationShedName}
                                </div>
                            )}
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
                            >
                                <option value="">{t('select_gender')}</option>
                                <option value="female">{t('female')}</option>
                                <option value="male">{t('male')}</option>
                            </select>
                        </div>

                        {formik.values.gender === 'female' && !isFattening && (
                            <div className="input-group">
                                <label htmlFor="female_Condition">{t('female_condition')}</label>
                                <input
                                    type="text"
                                    id="female_Condition"
                                    name="female_Condition"
                                    value={formik.values.female_Condition}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
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
                            >
                                <option value="">{t('select_condition')}</option>
                                <option value="purchase">{t('purchase')}</option>
                                {!isFattening && (
                                    <option value="born at farm">{t('born_at_farm')}</option>
                                )}
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
                                    >
                                        <option value="">{t('select_teething')}</option>
                                        <option value="two">{t('two')}</option>
                                        <option value="four">{t('four')}</option>
                                        <option value="six">{t('six')}</option>
                                    </select>
                                </div>
                            </>
                        ) : formik.values.animaleCondation === 'born at farm' && !isFattening && (
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
                                    />
                                </div>
                            </>
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

                {animalData && (
                    <div className="success-message">
                        <h3>{t('animal_details')}</h3>
                        <p>{t('animal_updated_successfully')}</p>
                    </div>
                )}
            </form>
        </div>
    );
}

export default EditAnimal;
