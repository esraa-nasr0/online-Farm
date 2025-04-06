import React, { useEffect, useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { IoIosSave } from 'react-icons/io';
import { useParams } from 'react-router-dom';

export default function EditBreeding() {
    const { id } = useParams(); // Get the ID from URL parameters
    const [showAlert, setShowAlert] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [birthEntries, setBirthEntries] = useState([{ tagId: '', gender: '', birthweight: '', expectedWeaningDate: '' }]);
    
// Helper function to generate headers with the latest token
const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
  
    // Ensure the token has only one "Bearer" prefix
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
  
    return {
        Authorization: formattedToken
    };
  };

    async function fetchBreedingData() {
        const headers = getHeaders(); // Get the latest headers
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
        fetchBreedingData(); // Fetch data when component mounts
    }, [id]);

    const editBreeding = async (values) => {
        const headers = getHeaders(); // Get the latest headers
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
                await fetchBreedingData(); // Fetch new data after update
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
            numberOfBirths: 1,
        },
        validationSchema: Yup.object({
            tagId: Yup.string().required('Tag ID is required'),
            deliveryState: Yup.string().required('Delivery state is required').max(50, 'Delivery state must be 50 characters or less'),
            deliveryDate: Yup.date().required('Delivery date is required').typeError('Invalid date format'),
            numberOfBirths: Yup.number().required('Number of births is required').min(1, 'At least 1').max(4, 'No more than 4'),
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
        <div className="container" >
            <div className="title2">Edit Breeding</div>

            <form onSubmit={formik.handleSubmit} className="mt-5">
                {isLoading ? (
                    <button type="submit" className="btn button2" disabled>
                    <i className="fas fa-spinner fa-spin"></i>
                    </button>
                    ) : (
                    <button type="submit" className="btn button2">
                    <IoIosSave /> Save
                    </button>
                    )}

                <div className="animaldata">
                    <div className="input-box">
                        <label className="label" htmlFor="tagId">Tag ID</label>
                        <input
                            {...formik.getFieldProps('tagId')}
                            placeholder="Enter your Tag ID"
                            id="tagId"
                            type="text"
                            className="input2"
                        />
                        {formik.touched.tagId && formik.errors.tagId && <p className="text-danger">{formik.errors.tagId}</p>}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="deliveryState">Delivery State</label>
                        <input
                            {...formik.getFieldProps('deliveryState')}
                            placeholder="Enter your delivery state"
                            id="deliveryState"
                            type="text"
                            className="input2"
                        />
                        {formik.touched.deliveryState && formik.errors.deliveryState && <p className="text-danger">{formik.errors.deliveryState}</p>}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="deliveryDate">Delivery Date</label>
                        <input
                            {...formik.getFieldProps('deliveryDate')}
                            placeholder="Enter your delivery date"
                            id="deliveryDate"
                            type="date"
                            className="input2"
                        />
                        {formik.touched.deliveryDate && formik.errors.deliveryDate && <p className="text-danger">{formik.errors.deliveryDate}</p>}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="numberOfBirths">Number of Births</label>
                        <input
                            value={formik.values.numberOfBirths}
                            onChange={handleNumberOfBirthsChange}
                            placeholder="Enter number of births"
                            id="numberOfBirths"
                            type="number"
                            className="input2"
                            name="numberOfBirths"
                        />
                        {formik.touched.numberOfBirths && formik.errors.numberOfBirths && <p className="text-danger">{formik.errors.numberOfBirths}</p>}
                    </div>

                    {birthEntries.map((entry, index) => (
                        <div key={`birth-entry-${index}`} className="input-box">
                            <label className="label" htmlFor={`birthEntries-${index}-tagId`}>Calf Tag ID {index + 1}</label>
                            <input
                                value={entry.tagId}
                                onChange={(e) => handleBirthEntriesChange(e, index)}
                                placeholder="Enter Calf Tag ID"
                                id={`birthEntries-${index}-tagId`}
                                name="tagId"
                                type="text"
                                className="input2"
                            />

                            <label className="label" htmlFor={`birthEntries-${index}-gender`}>Gender {index + 1}</label>
                            <input
                                value={entry.gender}
                                onChange={(e) => handleBirthEntriesChange(e, index)}
                                placeholder="Enter Gender"
                                id={`birthEntries-${index}-gender`}
                                name="gender"
                                type="text"
                                className="input2"
                            />

                            <label className="label" htmlFor={`birthEntries-${index}-birthweight`}>Birthweight {index + 1}</label>
                            <input
                                value={entry.birthweight}
                                onChange={(e) => handleBirthEntriesChange(e, index)}
                                placeholder="Enter Birthweight"
                                id={`birthEntries-${index}-birthweight`}
                                name="birthweight"
                                type="text"
                                className="input2"
                            />

                            <label className="label" htmlFor={`birthEntries-${index}-expectedWeaningDate`}>Expected Weaning Date {index + 1}</label>
                            <input
                                value={entry.expectedWeaningDate}
                                onChange={(e) => handleBirthEntriesChange(e, index)}
                                placeholder="Enter Expected Weaning Date"
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
