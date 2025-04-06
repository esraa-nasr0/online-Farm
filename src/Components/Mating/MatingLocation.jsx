import axios from 'axios';
import { useFormik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { IoIosSave } from "react-icons/io";
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import { LocationContext } from '../../Context/LocationContext';


function MatingLocation() {
    const [showAlert, setShowAlert] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const [matingData, setMatingData] = useState(null);
    const { t } = useTranslation();
    const {LocationMenue} = useContext(LocationContext)
    

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return { Authorization: formattedToken };
    };
    const fetchLocation = async () => {
                try {
                    const { data } = await LocationMenue();
                    if (data.status === 'success' && Array.isArray(data.data.locationSheds)) {
                        setMatingData(data.data.locationSheds);
                    } else {
                        setMatingData([]); 
                    }
                } catch (err) {
                    setError('Failed to load treatment data');
                    setMatingData([]); 
                }
            };
        
            useEffect(() => {
                fetchLocation();
            }, [LocationMenue]);
        

    async function submitMating(value) {
        const headers = getHeaders();
        setisLoading(true); 
        try {
            let { data } = await axios.post(
                `https://farm-project-bbzj.onrender.com/api/mating/AddMatingByLocation`,
                value,
                { headers }
            );
            console.log('Submitting form with values:', value);
            console.log('Headers:', headers);
            console.log('Response:', data);

            if (data.status === "success") {
                setisLoading(false);
                setMatingData(data.data.mating);
                setShowAlert(true);
                Swal.fire({
                    title: t('success_title'),
                    text: t('mating_success_message'),
                    icon: 'success',
                    confirmButtonText: t('ok')
                });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || t('error_message');
            setError(errorMessage);
        }
    }

    let formik = useFormik({
        initialValues: {
            locationShed: '',
            matingType: '',
            maleTag_id: '',
            matingDate: '',
            sonarDate: '',
        },
        onSubmit: submitMating
    });

    return (
        <div className="container">
            <div className="title2">{t('mating')}</div>
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
    <label className="label" htmlFor="locationShed">{t('location_shed')}</label>
    <select
        id="locationShed"
        name="locationShed"
        className="input2"
        value={formik.values.locationShed}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
    >
        <option value="">{t('select_location_shed')}</option>
        {matingData && matingData.map((shed) => (
            <option key={shed._id} value={shed._id}>{shed.locationShedName}</option>
        ))}
    </select>
    {formik.errors.locationShed && formik.touched.locationShed && <p className="text-danger">{formik.errors.locationShed}</p>}
</div>
                    <div className="input-box">
                        <label className="label" htmlFor="matingType">{t('mating_type')}</label>
                        <select value={formik.values.matingType} onChange={formik.handleChange} onBlur={formik.handleBlur} className="input2" name="matingType" id="matingType">
                            <option value="">{t('mating_type')}</option>
                            <option value="Natural">{t('natural')}</option>
                        </select>
                    </div>
                    <div className="input-box">
                        <label className="label" htmlFor="maleTag_id">{t('male_tag_id')}</label>
                        <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.maleTag_id} placeholder={t('enter_male_tag_id')} id="maleTag_id" type="text" className="input2" name="maleTag_id" />
                    </div>
                    <div className="input-box">
                        <label className="label" htmlFor="matingDate">{t('mating_date')}</label>
                        <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.matingDate} id="matingDate" type="date" className="input2" name="matingDate" />
                    </div>
                    <div className="input-box">
                        <label className="label" htmlFor="sonarDate">{t('sonar_date')}</label>
                        <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.sonarDate} id="sonarDate" type="date" className="input2" name="sonarDate" />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default MatingLocation;
