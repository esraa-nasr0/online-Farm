import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { IoIosSave } from "react-icons/io";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


function EditMating() {
    const { t } = useTranslation();
    const [showAlert, setShowAlert] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const [matingData, setMatingData] = useState(null);
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
    
async function editMating(values) {
    const headers = getHeaders();
    setisLoading(true); 
    try {
        const convertToISO = (dateString) => {
            if (!dateString) return undefined; // Return undefined for empty dates
            const date = new Date(dateString);
            return isNaN(date) ? undefined : date.toISOString();
        };

        const updatedValues = {
            ...values,
            matingDate: convertToISO(values.matingDate),
            sonarDate: convertToISO(values.sonarDate),
            expectedDeliveryDate: convertToISO(values.expectedDeliveryDate),
        };
        // Remove undefined values from the payload
        const payload = Object.fromEntries(
            Object.entries(updatedValues).filter(([_, v]) => v !== undefined)
        );
        console.log('Submitting form with values:', payload);
        let { data } = await axios.patch(
            `https://farm-project-bbzj.onrender.com/api/mating/UpdateMating/${id}`,
            payload,
            { headers }
        );

        if (data.status === "success") {
            setisLoading(false);
            setMatingData(data.data.mating);
            setShowAlert(true);
        }
    } catch (err) {
        const errorMessage = err.response?.data?.message || "An error occurred while processing your request";
        setError(errorMessage);
        console.log(err.response?.data);
        setisLoading(false);
    }
}

    useEffect(() => {
        async function fetchAnimal() {
            const headers = getHeaders(); // Get the latest headers
            try {
                let { data } = await axios.get(
                    `https://farm-project-bbzj.onrender.com/api/mating/GetSingleMating/${id}`, 
                    { headers }
                );
                console.log("API response:", data); 
    
                if (data && data.data && data.data.mating) {
                    const mating = data.data.mating;
                    const formatDate = (dateString) => dateString ? new Date(dateString).toISOString().split('T')[0] : '';

                    formik.setValues({
                        tagId: mating.tagId || '',
                        matingType: mating.matingType || '',
                        maleTag_id: mating.maleTag_id || '',
                        matingDate: formatDate(mating.matingDate),
                        sonarDate: formatDate(mating.sonarDate),
                        checkDays: mating.checkDays || null,
                        sonarRsult: mating.sonarRsult || null,
                        expectedDeliveryDate: formatDate(mating.expectedDeliveryDate) || '', // Set initial value for expectedDeliveryDate
                    });
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

    const formik = useFormik({
        initialValues: {
            tagId: '',
            matingType: '',
            maleTag_id: '',
            matingDate: '',
            checkDays: null,
            sonarRsult: null,
            expectedDeliveryDate: '', // Initialize this in the formik initial values
            sonarDate: '',
        },
        onSubmit: (values) => editMating(values),
    });

    return (
        <div className="container">
            <div className="title2"> Edit Mating</div>
            {error && <p className="text-danger">{error}</p>}
            
                {/* Expected Delivery Date Alert */}
                {showAlert && matingData && matingData.expectedDeliveryDate && (
    <div className="alert mt-5 p-4  alert-success">
        {t('expected_delivery_date')}: {new Date(matingData.expectedDeliveryDate).toLocaleDateString()}
    </div>
)}
            <form onSubmit={formik.handleSubmit} className="mt-5">
                <button type="submit" className="btn  button2" disabled={isLoading}>
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
/>
{formik.errors.tagId && formik.touched.tagId && <p className="text-danger">{formik.errors.tagId}</p>}
</div>

<div className="input-box">
<label className="label" htmlFor="matingType">{t('mating_type')}</label>
<select
    value={formik.values.matingType}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    className="input2"
    name="matingType"
    id="matingType"
>
    <option value="">{t('mating_type')}</option>
    <option value="Natural">{t('natural')}</option>
</select>
{formik.errors.matingType && formik.touched.matingType && <p className="text-danger">{formik.errors.matingType}</p>}
</div>

<div className="input-box">
<label className="label" htmlFor="maleTag_id">{t('male_tag_id')}</label>
<input
    onBlur={formik.handleBlur}
    onChange={formik.handleChange}
    value={formik.values.maleTag_id}
    placeholder="Enter your Male Tag ID"
    id="maleTag_id"
    type="text"
    className="input2"
    name="maleTag_id"
/>
{formik.errors.maleTag_id && formik.touched.maleTag_id && <p className="text-danger">{formik.errors.maleTag_id}</p>}
</div>

<div className="input-box">
<label className="label" htmlFor="matingDate">{t('mating_date')}</label>
<input
    onBlur={formik.handleBlur}
    onChange={formik.handleChange}
    value={formik.values.matingDate}
    id="matingDate"
    type="date"
    className="input2"
    name="matingDate"
/>
{formik.errors.matingDate && formik.touched.matingDate && <p className="text-danger">{formik.errors.matingDate}</p>}
</div>

                    <div className="input-box">
                        <label className="label" htmlFor="checkDays">{t('check_Days')}</label>
                        <select 
                            onBlur={formik.handleBlur} 
                            onChange={formik.handleChange} 
                            value={formik.values.checkDays} 
                            id="checkDays" 
                            className="input2" 
                            name="checkDays"
                        >
                            <option value="" disabled>{t('select_check_Days')}</option>
                            <option value="45">{t('45')}</option>
                            <option value="60">{t('60')}</option>
                            <option value="90">{t('90')}</option>
                        </select>
                    </div>

<div className="input-box">
<label className="label" htmlFor="sonarRsult">{t('sonar_result')}</label>
<select
    onBlur={formik.handleBlur}
    onChange={formik.handleChange}
    value={formik.values.sonarRsult}
    id="sonarRsult"
    className="input2"
    name="sonarRsult"
>
    <option value="" disabled>{t('select_sonar_result')}</option>
    <option value="positive">{t('positive')}</option>
    <option value="negative">{t('negative')}</option>
</select>
{formik.errors.sonarRsult && formik.touched.sonarRsult && <p className="text-danger">{formik.errors.sonarRsult}</p>}
</div>
<div className="input-box">
<label className="label" htmlFor="sonarDate">{t('sonar_date')}</label>
<input
    onBlur={formik.handleBlur}
    onChange={formik.handleChange}
    value={formik.values.sonarDate}
    id="sonarDate"
    type="date"
    className="input2"
    name="sonarDate"
/>
{formik.errors.sonarDate && formik.touched.sonarDate && <p className="text-danger">{formik.errors.sonarDate}</p>}
</div>
                    <div className="input-box">
                        <label className="label" htmlFor="expectedDeliveryDate">{t('expected_delivery_date')}</label>
                        <input
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.expectedDeliveryDate}
                            id="expectedDeliveryDate"
                            type="date"
                            className="input2"
                            name="expectedDeliveryDate"
                        />
                        {formik.errors.expectedDeliveryDate && formik.touched.expectedDeliveryDate && <p className="text-danger">{formik.errors.expectedDeliveryDate}</p>}
                    </div>
                </div>
            </form>

        </div>
    );
}

export default EditMating; 
