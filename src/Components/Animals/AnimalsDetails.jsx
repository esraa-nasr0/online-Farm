import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { IoIosSave } from "react-icons/io";
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import { LocationContext } from '../../Context/LocationContext';
import { BreedContext } from '../../Context/BreedContext';

function AnimalsDetails() {
    const { t } = useTranslation();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [responseData, setResponseData] = useState(null);
    const [locationSheds, setLocationSheds] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false); // حالة جديدة لتتبع الإرسال
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
        // إذا كانت البيانات قد أرسلت بالفعل، لا تفعل شيئاً
        if (isSubmitted) {
            return;
        }

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
                setIsSubmitted(true); // تحديث حالة الإرسال
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
        <div className="container">
            <div className="title2">Add Animal</div>
            <p className="text-danger">{error}</p>
            <form onSubmit={formik.handleSubmit} className='mt-5'>
                {responseData && (
                    <div className="alert mt-5 p-4 alert-success">
                        Age In Days: {responseData.ageInDays}
                    </div>
                )}
                <button type="submit" className="btn button2" disabled={isLoading}>
                    {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <IoIosSave />} {t('save')}
                </button>
                <div className="animaldata">
                    <div className="input-box">
                        <label className="label" htmlFor="tagId">{t('tag_id')}</label>
                        <input 
                            onBlur={formik.handleBlur} 
                            onChange={formik.handleChange} 
                            value={formik.values.tagId} 
                            placeholder="Enter your Tag ID" 
                            id="tagId" 
                            type="text" 
                            className="input2" 
                            name="tagId"
                            disabled={isSubmitted}
                        />
                        {formik.errors.tagId && formik.touched.tagId && ( 
                            <p className="text-danger">{formik.errors.tagId}</p> 
                        )}
                    </div>
                    <div className="input-box">
                        <label className="label" htmlFor="breed">{t('breed')}</label>
                        <select
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.breed}
                            id="breed"
                            className="input2"
                            name="breed"
                            disabled={isSubmitted}
                        >
                            <option value="">{t('select_breed')}</option>
                            {breeds.map((breed) => (
                                <option key={breed._id} value={breed.breedName}>
                                    {breed.breedName}
                                </option>
                            ))}
                        </select>
                        {formik.errors.breed && formik.touched.breed && (
                            <p className="text-danger">{formik.errors.breed}</p>
                        )}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="locationShedName">{t('location_shed')}</label>
                        <select
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.locationShedName}
                            id="locationShedName"
                            className="input2"
                            name="locationShedName"
                            disabled={isSubmitted}
                        >
                            <option value="">{t('select_location_shed')}</option>
                            {locationSheds.map((shed) => (
                                <option key={shed._id} value={shed.locationShedName}>
                                    {shed.locationShedName}
                                </option>
                            ))}
                        </select>
                        {formik.errors.locationShedName && formik.touched.locationShedName && (
                            <p className="text-danger">{formik.errors.locationShedName}</p>
                        )}
                    </div>
                    <div className="input-box">
                        <label className="label" htmlFor="animalType">{t('animal_type')}</label>
                        <select
                            value={formik.values.animalType}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="input2"
                            name="animalType"
                            id="animalType"
                            disabled={isSubmitted}
                        >
                            <option value="">{t('animal_type')}</option>
                            <option value="goat">{t('goat')}</option>
                            <option value="sheep">{t('sheep')}</option>
                        </select>
                        {formik.errors.animalType && formik.touched.animalType && (
                            <p className="text-danger">{formik.errors.animalType}</p>
                        )}
                    </div>
                    <div className="input-box">
                        <label className="label" htmlFor="gender">{t('gender')}</label>
                        <select
                            value={formik.values.gender}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="input2"
                            name="gender"
                            id="gender"
                            disabled={isSubmitted}
                        >
                            <option value="">{t('gender')}</option>
                            <option value="female">{t('female')}</option>  
                            <option value="male">{t('male')}</option>
                        </select>
                        {formik.errors.gender && formik.touched.gender && (
                            <p className="text-danger">{formik.errors.gender}</p>
                        )}
                    </div>
                    {formik.values.gender === 'female' && (
                        <div className="input-box">
                            <label className="label" htmlFor="female_Condition">{t('female_condition')}</label>
                            <input 
                                onBlur={formik.handleBlur} 
                                onChange={formik.handleChange} 
                                value={formik.values.female_Condition} 
                                placeholder="Enter your Female Condition" 
                                id="female_Condition" 
                                type="text" 
                                className="input2" 
                                name="female_Condition"
                                disabled={isSubmitted}
                            />
                            {formik.errors.female_Condition && formik.touched.female_Condition && (
                                <p className="text-danger">{formik.errors.female_Condition}</p>
                            )}
                        </div>
                    )}
                    <div className="input-box">
                        <label className="label" htmlFor="animaleCondation">{t('animal_condition')}</label>
                        <select
                            value={formik.values.animaleCondation}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="input2"
                            name="animaleCondation"
                            id="animaleCondation"
                            disabled={isSubmitted}>
                            <option value="">{t('animal_condition')}</option>
                            <option value="purchase">{t('purchase')}</option>
                            <option value="born at farm">{t('born_at_farm')}</option>
                        </select>
                        {formik.errors.animaleCondation && formik.touched.animaleCondation && (<p className="text-danger">{formik.errors.animaleCondation}</p>)}
                    </div>
                    {formik.values.animaleCondation === 'purchase' && (<>
                        <div className="input-box">
                            <label className="label" htmlFor="traderName">{t('trader_name')}</label>
                            <input
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.traderName}
                                placeholder="Enter Trader Name"
                                id="traderName"
                                type="text"
                                className="input2"
                                name="traderName"
                                disabled={isSubmitted}
                                />
                            {formik.errors.traderName && formik.touched.traderName && (<p className="text-danger">{formik.errors.traderName}</p>)}
                        </div>

                        <div className="input-box">
                            <label className="label" htmlFor="purchaseDate">{t('purchase_date')}</label>
                            <input
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.purchaseDate}
                                id="purchaseDate"
                                type="date"
                                className="input2"
                                name="purchaseDate"
                                disabled={isSubmitted}
                                />
                            {formik.errors.purchaseDate && formik.touched.purchaseDate && (<p className="text-danger">{formik.errors.purchaseDate}</p>)}
                        </div>

                        <div className="input-box">
                            <label className="label" htmlFor="purchasePrice">{t('purchase_price')}</label>
                            <input
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.purchasePrice}
                                placeholder="Enter Purchase Price"
                                id="purchasePrice"
                                type="number"
                                className="input2"
                                name="purchasePrice"
                                disabled={isSubmitted}
                            />
                            {formik.errors.purchasePrice && formik.touched.purchasePrice && (<p className="text-danger">{formik.errors.purchasePrice}</p>)}
                        </div>

                        <div className="input-box">
                            <label className="label" htmlFor="teething">{t('teething')}</label>
                            <select
                                value={formik.values.teething}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} className="input2" name="teething" id="teething" disabled={isSubmitted}>
                                <option value="">{t('teething')}</option>
                                <option value="two">{t('two')}</option>
                                <option value="four">{t('four')}</option>
                                <option value="six">{t('six')}</option>
                            </select>
                            {formik.errors.teething && formik.touched.teething && (<p className="text-danger">{formik.errors.teething}</p>)}
                        </div>
                    </>)}

                    {formik.values.animaleCondation === 'born at farm' && (<>
                        <div className="input-box">
                            <label className="label" htmlFor="motherId">{t('mother_id')}</label>
                            <input 
                                onBlur={formik.handleBlur} 
                                onChange={formik.handleChange} 
                                value={formik.values.motherId} 
                                placeholder="Enter your Mother ID" 
                                id="motherId" 
                                type="text" 
                                className="input2" 
                                name="motherId"
                                disabled={isSubmitted}
                            />
                            {formik.errors.motherId && formik.touched.motherId ? <p className="text-danger">{formik.errors.motherId}</p> : ""}
                        </div>

                        <div className="input-box">
                            <label className="label" htmlFor="fatherId">{t('father_id')}</label>
                            <input 
                                onBlur={formik.handleBlur} 
                                onChange={formik.handleChange} 
                                value={formik.values.fatherId} 
                                placeholder="Enter your Father ID" 
                                id="fatherId" 
                                type="text" 
                                className="input2" 
                                name="fatherId"
                                disabled={isSubmitted}
                            />
                            {formik.errors.fatherId && formik.touched.fatherId ? <p className="text-danger">{formik.errors.fatherId}</p> : ""}
                        </div>

                        <div className="input-box">
                            <label className="label" htmlFor="birthDate">{t('birth_date')}</label>
                            <input 
                                onBlur={formik.handleBlur} 
                                onChange={formik.handleChange} 
                                value={formik.values.birthDate}  
                                id="birthDate" 
                                type="date" 
                                className="input2" 
                                name="birthDate"
                                disabled={isSubmitted}
                            />
                            {formik.errors.birthDate && formik.touched.birthDate ? <p className="text-danger">{formik.errors.birthDate}</p> : ""}
                        </div>
                    </>)}
                </div>
            </form>
        </div>
    );
}

export default AnimalsDetails;