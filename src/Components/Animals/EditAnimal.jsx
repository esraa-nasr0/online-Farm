import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { IoIosSave } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';


function EditAnimal() {
    const { t } = useTranslation();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [animalData, setAnimalData] = useState(null);
    const [showAlert, setShowAlert] = useState(false);

    const { id } = useParams();

// Helper function to generate headers with the latest token
const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');

    // Ensure the token has only one "Bearer" prefix
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;

    return {
        Authorization: formattedToken
    };
};

    async function editAnimals(values) {
        const headers = getHeaders(); // Get the latest headers

        setIsLoading(true);
        try {
            let { data } = await axios.patch(
                `https://farm-project-bbzj.onrender.com/api/animal/updateanimal/${id}`, 
                values,
                { headers }
            );
            setError(null);
            if (data.status === "success") {
                console.log(data);
                setIsLoading(false);
                setAnimalData(data.data.animal);
                setShowAlert(true); 
                Swal.fire({
                            title: 'Success!',
                            text: 'Animal data added successfully!',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            }); 
            }
        } catch (error) {
            console.error("Failed to edit animal:", error);
            setError("Failed to update animal. Please try again.");
            setIsLoading(false); 
        }
    }

    const formik = useFormik({
        initialValues: {
            tagId: '',
            animalType: '',
            breed: '',
            gender: '',
            motherId: '',
            fatherId: '',
            birthDate: '',
            locationShed: '',
            female_Condition: '',
            animaleCondation: '',
            traderName: '',
            purchaseDate: '',
            purchasePrice: '',
            teething: '',
        },
        onSubmit: editAnimals
    });

    useEffect(() => {
        async function fetchAnimal() {
            const headers = getHeaders(); // Get the latest headers
            try {
                let { data } = await axios.get(
                    `https://farm-project-bbzj.onrender.com/api/animal/getsinglanimals/${id}`, 
                    { headers }
                );
                const formatDate = (dateString) => dateString ? new Date(dateString).toISOString().split('T')[0] : '';
    
                if (data && data.data && data.data.animal) {
                    formik.setValues({
                        tagId: data.data.animal.tagId || '',
                        breed: data.data.animal.breed || '',
                        animalType: data.data.animal.animalType || '',
                        gender: (data.data.animal.gender || '').toLowerCase(),
                        female_Condition: data.data.animal.female_Condition || '',
                        motherId: data.data.animal.motherId || '',
                        fatherId: data.data.animal.fatherId || '',
                        birthDate: formatDate(data.data.animal.birthDate || ''),
                        locationShed: data.data.animal.locationShed || '',
                        animaleCondation: data.data.animal.animaleCondation || '',
                        traderName: data.data.animal.traderName || '',
                        purchaseDate: formatDate(data.data.animal.purchaseDate || ''),
                        purchasePrice: data.data.animal.purchasePrice || '',
                        teething: data.data.animal.teething || '',
                    });
                    setIsDataLoaded(true);  // Set flag after values are updated
                } else {
                    throw new Error("Unexpected API response structure");
                }
            } catch (error) {
                console.error("Failed to fetch animal data:", error);
                setError("Failed to fetch animal details.");
            }
        }
        fetchAnimal();
    }, [id]);

    useEffect(() => {
        if (formik.values.gender === "female") {
            formik.setFieldValue('female_Condition', formik.values.female_Condition || '');
        }
    }, [formik.values.gender]);

    if (!isDataLoaded) {
        return <div>Loading...</div>;
    }


    return (
        <div className="container">
            <p className="text-danger">{error}</p>
    <form onSubmit={formik.handleSubmit} className='mt-5'>
                <div className=' d-flex vaccine align-items-center justify-content-between'>
                <div className="title-v">Edit Animal</div>
                <button type="submit" className="btn  button2" disabled={isLoading}>
                {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <IoIosSave />} {t('save')}
                </button>
                </div>
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
                        />
                        {formik.errors.tagId && formik.touched.tagId && ( 
                            <p className="text-danger">{formik.errors.tagId}</p> 
                        )}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="breed">{t('breed')}</label>
                        <input 
                            onBlur={formik.handleBlur} 
                            onChange={formik.handleChange} 
                            value={formik.values.breed} 
                            placeholder="Enter Breed" 
                            id="breed" 
                            type="text" 
                            className="input2" 
                            name="breed"
                        />
                        {formik.errors.breed && formik.touched.breed && ( 
                            <p className="text-danger">{formik.errors.breed}</p> 
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
            id="animaleCondation">
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
            name="traderName"/>
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
            name="purchaseDate"/>
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
            />
            {formik.errors.purchasePrice && formik.touched.purchasePrice && (<p className="text-danger">{formik.errors.purchasePrice}</p>)}
        </div>
                            
        <div className="input-box">
        <label className="label" htmlFor="teething">{t('teething')}</label>
        <select
            value={formik.values.teething}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur} className="input2" name="teething" id="teething">
            <option value="">{t('teething')}</option>
            <option value="two">{t('two')}</option>
            <option value="four">{t('four')}</option>
            <option value="six">{t('six')}</option>
            </select>
            {formik.errors.teething && formik.touched.teething && (<p className="text-danger">{formik.errors.teething}</p>)}
            </div></>)}

        {formik.values.animaleCondation === 'born at farm' && (<>
        <div className="input-box">
            <label className="label" htmlFor="motherId">{t('mother_id')}</label>
            <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.motherId} placeholder="Enter your Mother ID" id="motherId" type="text" className="input2" name="motherId"/>
            {formik.errors.motherId && formik.touched.motherId?<p className="text-danger">{formik.errors.motherId}</p>:""}
        </div>

        <div className="input-box">
            <label className="label" htmlFor="fatherId">{t('father_id')}</label>
            <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.fatherId} placeholder="Enter your Father ID" id="fatherId" type="text" className="input2" name="fatherId"/>
            {formik.errors.fatherId && formik.touched.fatherId?<p className="text-danger">{formik.errors.fatherId}</p>:""}
        </div>

        <div className="input-box">
            <label className="label" htmlFor="birthDate">{t('birth_date')}</label>
            <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.birthDate}  id="birthDate" type="date" className="input2" name="birthDate"/>
            {formik.errors.birthDate && formik.touched.birthDate?<p className="text-danger">{formik.errors.birthDate}</p>:""}
        </div> 
            </>)}
            <div className="input-box">  
            <label className="label" htmlFor="locationShed">{t('location_shed')}</label>
            <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.locationShed} placeholder="Enter your Location Shed" id="locationShed" type="text" className="input2" name="locationShed"/>
            {formik.errors.locationShed && formik.touched.locationShed?<p className="text-danger">{formik.errors.locationShed}</p>:""}
            </div>
                </div>
            </form>
        </div>

    );
}

export default EditAnimal;