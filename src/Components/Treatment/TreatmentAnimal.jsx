import axios from 'axios';
import { useFormik } from 'formik';
import React, { useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { IoIosSave } from "react-icons/io";
import * as Yup from 'yup';
import { TreatmentContext } from '../../Context/TreatmentContext';

function TreatmentAnimal() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [treatmentData, setTreatmentData] = useState([]);
    const { getTreatmentMenue } = useContext(TreatmentContext);

    
// Helper function to generate headers with the latest token
const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
  
    // Ensure the token has only one "Bearer" prefix
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
  
    return {
        Authorization: formattedToken
    };
  };
    // Fetch treatment menu options when the component mounts
    const fetchTreatments = async () => {
        try {
            const { data } = await getTreatmentMenue();
            if (data.status === 'success' && Array.isArray(data.data)) {
                setTreatmentData(data.data);
            } else {
                setTreatmentData([]); // Ensure treatmentData is always an array
            }
        } catch (err) {
            setError('Failed to load treatment data');
            setTreatmentData([]); // Ensure treatmentData is always an array
        }
    };

    useEffect(() => {
        fetchTreatments();
    }, [getTreatmentMenue]);

    // Submit treatment data
    async function submitTreatment(values) {
        const headers = getHeaders(); // Get the latest headers
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await axios.post(
                `https://farm-project-bbzj.onrender.com/api/treatment/addtreatmentbyanimal`,
                values,
                { headers }
            );

            if (data.status === "SUCCESS") {
                setIsLoading(false);
                console.log(data.data.treatment);
                setTreatmentData(data.data.treatment);
                Swal.fire({
                    title: 'Success!',
                    text: 'Treatment data added successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
            }
        }catch (error) {
                    Swal.fire('Error', error.response?.data?.message, 'error');
                } finally {
                    setIsLoading(false);
                } 
    }

    // Validation Schema for Formik
    const validationSchema = Yup.object({
        tagId: Yup.string().required('Tag Id is required'),
        date: Yup.date().required('Date is required'),
        treatments: Yup.array().of(
            Yup.object({
                treatmentId: Yup.string().required('Treatment ID is required'),
                volume: Yup.number()
                    .required('Volume is required')
                    .positive('Volume must be positive')
                    .typeError('Volume must be a valid number'),
            })
        ).min(1, 'At least one treatment must be selected'),
    });

    const formik = useFormik({
        initialValues: {
            tagId: "",
            treatments: [{ treatmentId: "", volume: "" }],
            date: "",
        },
        validationSchema,
        onSubmit: submitTreatment,
    });

    // Add a new treatment row
    const addTreat = () => {
        formik.setFieldValue('treatments', [
            ...formik.values.treatments,
            { treatmentId: '', volume: '' },
        ]);
    };

    // Handling treatment change 
    const handleTreatmentChange = (e, index) => {
        const { name, value } = e.target;
        const updatedTreatments = [...formik.values.treatments];
        updatedTreatments[index][name] = name === 'volume' ? Number(value) : value; // Ensuring volume is a number
        formik.setFieldValue('treatments', updatedTreatments);
    };

    return (
        <div className='container'>
            <div className="title2">Treatment by Animal</div>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={formik.handleSubmit} className='mt-5'>
                {isLoading ? (
                    <button type="submit" className="btn button2" disabled>
                        <i className="fas fa-spinner fa-spin"></i>
                    </button>
                ) : (
                    <button type="submit" className="btn button2">
                        <IoIosSave /> Save
                    </button>
                )}
                <div className='animaldata'>
                    <div className="input-box">
                        <label className="label" htmlFor="tagId">Tag Id</label>
                        <input
                            autoComplete="off"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.tagId}
                            id="tagId"
                            placeholder="Enter The Tag Id"
                            type="text"
                            className="input2"
                            name="tagId"
                            aria-label="Tag Id"
                        />
                        {formik.errors.tagId && formik.touched.tagId && <p className="text-danger">{formik.errors.tagId}</p>}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="date">Date</label>
                        <input
                            autoComplete="off"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.date}
                            placeholder="Enter The Treatment Date"
                            id="date"
                            type="date"
                            className="input2"
                            name="date"
                            aria-label="Treatment Date"
                        />
                        {formik.errors.date && formik.touched.date && <p className="text-danger">{formik.errors.date}</p>}
                    </div>

                    {/* Loop through treatments and render form fields */}
                    {Array.isArray(formik.values.treatments) && formik.values.treatments.length > 0 && formik.values.treatments.map((treatment, index) => (
                        <div key={index} className="input-box">
                            {/* Treatment Name - Dropdown */}
                            <div>
                                <label className="label" htmlFor={`treatmentName-${index}`}>Treatment Name</label>
                                <select
                                    id={`treatmentName-${index}`}
                                    name="treatmentId"
                                    className="input2"
                                    value={treatment.treatmentId}
                                    onChange={(e) => handleTreatmentChange(e, index)}
                                    onBlur={formik.handleBlur}
                                    aria-label="Treatment Name"
                                >
                                    <option value="">Select Treatment</option>
                                    {Array.isArray(treatmentData) && treatmentData.map((treatmentOption) => (
                                        <option key={treatmentOption._id} value={treatmentOption._id}>
                                            {treatmentOption.name}
                                        </option>
                                    ))}
                                </select>
                                {formik.errors.treatments?.[index]?.treatmentId && formik.touched.treatments?.[index]?.treatmentId && (
                                    <p className="text-danger">{formik.errors.treatments[index].treatmentId}</p>
                                )}
                            </div>

                            {/* Volume Input */}
                            <div>
                                <label className="label" htmlFor={`volume-${index}`}>Volume</label>
                                <input
                                    autoComplete="off"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={treatment.volume}
                                    placeholder="Enter The Volume"
                                    id={`volume-${index}`}
                                    type="number"
                                    className="input2"
                                    name={`treatments[${index}].volume`}
                                    aria-label="Treatment Volume"
                                />
                                {formik.errors.treatments?.[index]?.volume && formik.touched.treatments?.[index]?.volume && (
                                    <p className="text-danger">{formik.errors.treatments[index].volume}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={addTreat} className="btn button2">
                    + 
                </button>
            </form>
        </div>
    );
}

export default TreatmentAnimal;