import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { IoIosSave } from 'react-icons/io';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // import


function EditWeight() {
    const { t } = useTranslation(); // hook
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams(); // Get the animal ID from the URL params
    let navigate = useNavigate();


// Helper function to generate headers with the latest token
const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
    // Ensure the token has only one "Bearer" prefix
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
    return {
        Authorization: formattedToken
    };
};


    async function editWeight(values) {
        const headers = getHeaders(); // Get the latest headers
        setIsLoading(true); 
        try {
            // Convert 'yyyy-MM-dd' to ISO format if needed, or keep it empty if no valid date is provided
            const convertToISO = (dateString) => {
                if (dateString && !isNaN(new Date(dateString))) {
                    return new Date(dateString).toISOString();
                }
                return null;  // Ensure you're not sending invalid data to the server
            };
            const updatedValues = {
                ...values,
                Date: convertToISO(values.Date),
            };
            let { data } = await axios.patch(
                `https://farm-project-bbzj.onrender.com/api/weight/updateweight/${id}`,
                updatedValues,
                { headers }
            );
            console.log('Submitting form with values:', updatedValues);
    
            if (data.status === "success") {
                setIsLoading(false);
                navigate('/weightTable');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "An error occurred while processing your request";
            setError(errorMessage);
            console.log(err.response?.data);
        }
    }

    
    useEffect(() => {
        async function fetchAnimal() {
            const headers = getHeaders(); // Get the latest headers
            try {
                let { data } = await axios.get(
                    `https://farm-project-bbzj.onrender.com/api/weight/GetSingleWeight/${id}`, 
                    { headers }
                );
                console.log("API response:", data); // Log the entire response
                // Check if the structure matches your expectation
                if (data && data.data && data.data.weight) {
                    const weight = data.data.weight;
                    // Convert ISO date strings to yyyy-MM-dd format
                    const formatDate = (dateString) => dateString ? new Date(dateString).toISOString().split('T')[0] : '';
                    formik.setValues({
                        tagId: weight.tagId || '',
                        weightType: weight.weightType || '',
                        weight: weight.weight || '',
                        Date: formatDate(weight.Date),
                        height: weight.height || '',
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
    

    const validationSchema = Yup.object({

    tagId: Yup.string().max(10, 'Tag ID max length is 10').required('Tag ID is required'),
    weightType: Yup.string().required('Weight Type is required'),
    weight: Yup.string().max(10, 'Weight max length is 10').required('Weight is required'),
    height: Yup.string().max(10, 'Height max length is 10').required('Height is required'),
    Date: Yup.date().required('Date is required'),
    });

    const formik = useFormik({
    initialValues: {
        tagId: '',
        weightType: '',
        weight: '',
        height: '',
        Date: '',
    },
    validationSchema,
    onSubmit: editWeight,
});

return (
    <>
    <div className='container'>
    <div className='title2'>{t('edit_weight')}</div>
    <p className='text-danger'>{error}</p>

        <form onSubmit={formik.handleSubmit} className='mt-5'>
        {isLoading ? (
            <button type='submit' className='btn  button2'>
            <i className='fas fa-spinner fa-spin'></i>
            </button>
        ) : (
            <button type='submit' className='btn btn-dark button2'>
    <IoIosSave /> {t('save')}
    </button>
        )}

        <div className='animaldata'>
            <div className='input-box'>
            <label className='label' htmlFor='tagId'>
            {t('tag_id')}            
            </label>
            <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.tagId}
                placeholder={t('enter_tag_id')}
                id='tagId'
                type='text'
                className='input2'
                name='tagId'
            />
            {formik.errors.tagId && formik.touched.tagId ? (
                <p className='text-danger'>{formik.errors.tagId}</p>
            ) : (
                ''
            )}
            </div>

            <div className='input-box'>
            <label className='label' htmlFor='weightType'>
            {t('weight_type')}
            </label>
            <select
                value={formik.values.weightType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='input2'
                name='weightType'
                id='weightType'
                aria-label='Default select example'
            >
                <option value='' disabled>
                {t('select_weight_type')}
                </option>
                <option value='birth'>{t('birth')}</option>
                <option value='weaning'>{t('weaning')}</option>
                <option value='regular'>{t('regular')}</option>
            </select>
            {formik.errors.weightType && formik.touched.weightType ? (
                <p className='text-danger'>{formik.errors.weightType}</p>
            ) : (
                ''
            )}
            </div>

            <div className='input-box'>
            <label className='label' htmlFor='weight'>
            {t('weight')}
            </label>
            <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.weight}
                placeholder={t('enter_weight')}
                id='weight'
                type='text'
                className='input2'
                name='weight'
            />
            {formik.errors.weight && formik.touched.weight ? (
                <p className='text-danger'>{formik.errors.weight}</p>
            ) : (
                ''
            )}
            </div>

            <div className='input-box'>
            <label className='label' htmlFor='height'>
            {t('height')}
            </label>
            <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.height}
                placeholder={t('enter_height')}
                id='height'
                type='text'
                className='input2'
                name='height'
            />
            {formik.errors.height && formik.touched.height ? (
                <p className='text-danger'>{formik.errors.height}</p>
            ) : (
                ''
            )}
            </div>

            <div className='input-box'>
            <label className='label' htmlFor='Date'>
            {t('date')}
            </label>
            <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.Date}
                id='Date'
                type='date'
                className='input2'
                name='Date'
            />
            {formik.errors.Date && formik.touched.Date ? (
                <p className='text-danger'>{formik.errors.Date}</p>
            ) : (
                ''
            )}
            </div>
        </div>
        </form>
    </div>
    </>
);
}

export default EditWeight;
