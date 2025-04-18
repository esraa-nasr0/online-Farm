import React, { useEffect, useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { IoIosSave } from 'react-icons/io';
import { useParams } from 'react-router-dom';

export default function EditExcluded() {
    const { id } = useParams(); // Get the ID from URL parameters
    const [showAlert, setShowAlert] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    
// Helper function to generate headers with the latest token
const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
  
    // Ensure the token has only one "Bearer" prefix
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
  
    return {
        Authorization: formattedToken
    };
  };
    // Function to fetch excluded data from the API
    async function fetchExclutedData() {
        const headers = getHeaders(); // Get the latest headers
        setIsLoading(true);
        try {
            const response = await axios.get(
                `https://farm-project-bbzj.onrender.com/api/excluded/getSingleExcludeds/${id}`,
                { headers }
            );
            const exclutedData = response.data.data.excluded;
            if (exclutedData) {
                formik.setValues({
                    tagId: exclutedData.tagId || '',
                    excludedType: exclutedData.excludedType || '',
                    price: exclutedData.price || '',
                    weight: exclutedData.weight || '',
                    Date: exclutedData.Date ? exclutedData.Date.split('T')[0] : '',
                });
            }
        } catch (error) {
            setError("Failed to fetch excluded data.");
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchExclutedData(); // Fetch data when component mounts
    }, [id]);

    // Function to edit the excluded data
    const editExcluted = async (values) => {
        const headers = getHeaders(); // Get the latest headers
        setIsLoading(true);
        try {
            const dataToSubmit = {
                tagId: values.tagId,
                excludedType: values.excludedType,
                price: values.price,
                weight: values.weight,
                Date: values.Date,
            };
            const { data } = await axios.patch(
                ` https://farm-project-bbzj.onrender.com/api/excluded/updateexcluded/${id}`,
                dataToSubmit,
                { headers }
            );
            console.log(data); // Check the response from the server

            if (data.status === "success") {
                setShowAlert(true);
                await fetchExclutedData(); // Fetch new data after update
            }
        } catch (err) {
            console.error("Error updating data:", err);
            const errorMessage = err.response?.data?.message || "An error occurred while processing your request";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            tagId: '',
            excludedType: '',
            price: '',
            weight: '',
            Date: '',
        },
        validationSchema: Yup.object({
            tagId: Yup.string().required('Tag ID is required'),
            excludedType: Yup.string().required('Excluded type is required'),
            price: Yup.string().required('Price is required'),
            weight: Yup.string().required('Weight is required'),
            Date: Yup.date().required('Date is required').typeError('Invalid date format'),
        }),
        onSubmit: (values) => editExcluted(values),
    });

    return (
        <div className="container">
            <div className="title2">Edit Excluded</div>
            {error && <p className="text-danger">{error}</p>}
            {showAlert && <div className="alert alert-success mt-3">Excluded information updated successfully!</div>}

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
                        <label className="label" htmlFor="excludedType">Excluded Type</label>
                        <input
                            {...formik.getFieldProps('excludedType')}
                            placeholder="Enter your excluded type"
                            id="excludedType"
                            type="text"
                            className="input2"
                        />
                        {formik.touched.excludedType && formik.errors.excludedType && <p className="text-danger">{formik.errors.excludedType}</p>}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="price">Price</label>
                        <input
                            {...formik.getFieldProps('price')}
                            placeholder="Enter the price"
                            id="price"
                            type="text"
                            className="input2"
                        />
                        {formik.touched.price && formik.errors.price && <p className="text-danger">{formik.errors.price}</p>}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="weight">Weight</label>
                        <input
                            {...formik.getFieldProps('weight')}
                            placeholder="Enter the weight"
                            id="weight"
                            type="text"
                            className="input2"
                        />
                        {formik.touched.weight && formik.errors.weight && <p className="text-danger">{formik.errors.weight}</p>}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="Date">Date</label>
                        <input
                            {...formik.getFieldProps('Date')}
                            placeholder="Enter the excluded date"
                            id="Date"
                            type="date"
                            className="input2"
                        />
                        {formik.touched.Date && formik.errors.Date && <p className="text-danger">{formik.errors.Date}</p>}
                    </div>
                </div>
            </form>
        </div>
    );
}