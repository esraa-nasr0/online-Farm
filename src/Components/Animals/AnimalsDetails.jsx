import { useFormik } from 'formik';
import React, {  useState } from 'react';
import axios from 'axios';
// import * as Yup from 'yup';
import { IoIosSave } from "react-icons/io";
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';



export default function AnimalsDetails() {
    const { t } = useTranslation();
    const [showAlert, setShowAlert] = useState(false);
    const [error ,setError] = useState(null);
    const [isLoading , setisLoading] = useState(false);
    const [animalData, setAnimalData] = useState(null);

    
    let Authorization = localStorage.getItem('Authorization')
    let headers = {
    Authorization:` Bearer ${Authorization}`
    }
    
    async function submitAnimals(value) {
        setisLoading(true);
        setError(null);
        try {
            let { data } = await axios.post(`https://farm-project-bbzj.onrender.com/api/animal/addanimal`, value, 
            { headers });
    
            if (data.status === "success") {
                setisLoading(false);
                setAnimalData(data.data.animal);
                setShowAlert(true);  // Optionally show the custom alert
                // Show SweetAlert success message
        Swal.fire({
            title: 'Success!',
            text: 'Animal data added successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
            });
            }
            
        } catch (err) {
            setisLoading(false);
            setError(err.response?.data?.message );
            console.log(err.response.data);  
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
        Teething: '',
        },
        // validationSchema,
        onSubmit:submitAnimals
    });
    

    return <>
        <div className="container">
     
        <p className="text-danger">{error}</p>
        
    {showAlert && animalData && (  
    <div className="alert mt-5 p-4 alert-success">  
    {t('animal_age_in_days')} {animalData.ageInDays} 
    </div>  
    )}  
        <form onSubmit={formik.handleSubmit} className='mt-5'>
    {isLoading ? (
                 
                 <div className=' d-flex vaccine align-items-center justify-content-between'>
                 <div className="title-v">Add Animal</div>
               
                 <button type="submit" className="btn button2">
                             <i className="fas fa-spinner fa-spin"></i>
                         </button>
 
                 </div>
                 
                     ) : (
                                <div className=' d-flex vaccine align-items-center justify-content-between'>
                                       <div className="title-v">Add Animal</div>
                                       <button type="submit" className="btn  button2" disabled={isLoading}>
                                           {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <IoIosSave />} Save
                                       </button>
                       
                                       </div>
                               
                     )}
        <div className="animaldata">
        <div className="input-box">
            <label className="label" htmlFor="tagId">{t('tag_id')}</label>
            <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.tagId} placeholder={t('enter_tag_id')} id="tagId" type="text" className="input2" name="tagId"/>
            {formik.errors.tagId && formik.touched.tagId && ( <p className="text-danger">{formik.errors.tagId}</p> )}
        </div>
        <div className="input-box">
            <label className="label" htmlFor="breed">{t('breed')}</label>
            <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.breed}placeholder={t('enter_breed')} id="breed" type="text" className="input2" name="breed"/>
            {formik.errors.breed && formik.touched.breed && ( <p className="text-danger">{formik.errors.breed}</p> )}
        </div>

                    <div className="input-box">
        <label className="label" htmlFor="animalType">{t('animal_type')}</label>
        <select
            value={formik.values.animalType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="input2"
            name="animalType"
            id="animalType">
            <option value="">{t('animal_type')}</option>
            <option value="goat">{t('goat')}</option>
            <option value="sheep">{t('sheep')}</option>
        </select>
        {formik.errors.animalType && formik.touched.animalType && (<p className="text-danger">{formik.errors.animalType}</p>)}
        </div>

        <div className="input-box">
        <label className="label" htmlFor="gender">{t('gender')}</label>
        <select
            value={formik.values.gender}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="input2"
            name="gender"
            id="gender">
            <option value="">{t('gender')}</option>
            <option value="female">{t('female')}</option>
            <option value="male">{t('male')}</option>
        </select>
        {formik.errors.gender && formik.touched.gender && (<p className="text-danger">{formik.errors.gender}</p>)}
        </div>

        {formik.values.gender === 'female' && (
            <div className="input-box">
            <label className="label" htmlFor="female_Condition">{t('female_condition')}</label>
            <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.female_Condition} placeholder={t('enter_female_condition')} id="female_Condition" type="text" className="input2" name="female_Condition"/>
        {formik.errors.female_Condition && formik.touched.female_Condition && (<p className="text-danger">{formik.errors.female_Condition}</p>)}
        </div>)}

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
            placeholder={t('enter_trader_name')}
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
            placeholder={t('enter_purchase_price')}
            id="purchasePrice"
            type="number"
            className="input2"
            name="purchasePrice"
            />
            {formik.errors.purchasePrice && formik.touched.purchasePrice && (<p className="text-danger">{formik.errors.purchasePrice}</p>)}
        </div>
                            
        <div className="input-box">
        <label className="label" htmlFor="Teething">{t('teething')}</label>
        <select
            value={formik.values.Teething}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur} className="input2" name="Teething" id="Teething">
            <option value="">{t('teething')}</option>
            <option value="two">{t('two')}</option>
            <option value="four">{t('four')}</option>
            <option value="six">{t('six')}</option>
            </select>
            {formik.errors.Teething && formik.touched.Teething && (<p className="text-danger">{formik.errors.Teething}</p>)}
            </div></>)}

        {formik.values.animaleCondation === 'born at farm' && (<>
        <div className="input-box">
            <label className="label" htmlFor="motherId">{t('mother_id')}</label>
            <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.motherId} placeholder={t('enter_mother_id')} id="motherId" type="text" className="input2" name="motherId"/>
            {formik.errors.motherId && formik.touched.motherId?<p className="text-danger">{formik.errors.motherId}</p>:""}
        </div>

        <div className="input-box">
            <label className="label" htmlFor="fatherId">{t('father_id')}</label>
            <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.fatherId} placeholder={t('enter_father_id')} id="fatherId" type="text" className="input2" name="fatherId"/>
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
            <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.locationShed} placeholder={t('enter_location_shed')} id="locationShed" type="text" className="input2" name="locationShed"/>
            {formik.errors.locationShed && formik.touched.locationShed?<p className="text-danger">{formik.errors.locationShed}</p>:""}
            </div>

                </div>
            </form> 

        </div>
    </>
}