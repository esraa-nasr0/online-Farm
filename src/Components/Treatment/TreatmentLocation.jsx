import axios from 'axios';
import { useFormik } from 'formik';
import React, { useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { IoIosSave } from "react-icons/io";
import * as Yup from 'yup';
import { TreatmentContext } from '../../Context/TreatmentContext';
import { LocationContext } from '../../Context/LocationContext';
import { useTranslation } from 'react-i18next';


function TreatmentLocation() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [locationSheds, setLocationSheds] = useState([]);
    const [treatmentOptions, setTreatmentOptions] = useState([]);
    
    const { getTreatmentMenue } = useContext(TreatmentContext);
    const { LocationMenue } = useContext(LocationContext);
    const { t } = useTranslation();
    
// Helper function to generate headers with the latest token
const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
    return {
        Authorization: formattedToken
    };
    };
    const fetchLocation = async () => {
        try {
            const { data } = await LocationMenue();
            if (data?.status === 'success' && Array.isArray(data.data.locationSheds)) {
                setLocationSheds(data.data.locationSheds);
            } else {
                setLocationSheds([]);
            }
        } catch (err) {
            setError('Failed to load location sheds');
            setLocationSheds([]);
        }
    };
    
    // Fetch treatment menu options when the component mounts
    const fetchTreatments = async () => {
        try {
            const { data } = await getTreatmentMenue();
            if (data?.status === 'success' && Array.isArray(data.data)) {
                setTreatmentOptions(data.data);
            } else {
                setTreatmentOptions([]);
            }
        } catch (err) {
            setError('Failed to load treatment data');
        }
    };

    useEffect(() => {
        fetchLocation();
    }, [LocationMenue]);

    useEffect(() => {
        fetchTreatments();
    }, [getTreatmentMenue]);


    async function submitTreatment(values) {
        const headers = getHeaders();
        console.log('Form Values:', values);
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await axios.post(
                `https://farm-project-bbzj.onrender.com/api/treatment/addtreatmentbylocationshed`,
                values,
                { headers }
            );
            if (data.status === "SUCCESS") {
                setIsLoading(false);
                Swal.fire({
                    title: 'Success!',
                    text: 'Treatment data added successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
            } else {
                setIsLoading(false);
                setError('An error occurred during the submission.');
            }
        } catch (err) {
            console.log('Error occurred:', err);
            setIsLoading(false);
        }
    }
    
    const validationSchema = Yup.object({
        locationShed: Yup.string().required('Location shed is required'),
        date: Yup.date().required('Date is required'),
        treatments: Yup.array()
            .of(
                Yup.object({
                    treatmentId: Yup.string().required('Treatment ID is required'),
                    volume: Yup.number()
                        .required('Volume is required')
                        .positive('Volume must be positive')
                        .typeError('Volume must be a valid number'),
                })
            )
            .min(1, 'At least one treatment must be selected'),
    });


    const formik = useFormik({
        initialValues: {
            locationShed: "",
            treatments: [{ treatmentId: "", volume: "" }],
            date: "",
        },
        validationSchema,
        onSubmit: submitTreatment,
    });

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
        updatedTreatments[index][name] = name === 'volume' ? Number(value) : value;
        formik.setFieldValue('treatments', updatedTreatments);
    };


    return (
        <div className='container'>
            <div className="title2">Treatment by Location Shed</div>
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
                            {locationSheds?.map((shed) => (
                                <option key={shed._id} value={shed._id}>{shed.locationShedName}</option>
                            ))}
                        </select>
                        {formik.touched.locationShed && formik.errors.locationShed && (
                            <p className="text-danger">{formik.errors.locationShed}</p>
                        )}
                    </div>


                    {/* Date Input */}
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
                        {formik.errors.date && formik.touched.date && (
                            <p className="text-danger">{formik.errors.date}</p>
                        )}
                    </div>

                    {/* Loop through treatments and render form fields */}
                    {formik.values.treatments.map((treatment, index) => (
                        <div key={index} className="input-box">
                            <label className="label" htmlFor={`treatment-${index}`}>Treatment Name</label>
                            <select
                                id={`treatment-${index}`}
                                name="treatmentId"
                                className="input2"
                                value={treatment.treatmentId}
                                onChange={(e) => handleTreatmentChange(e, index)}
                            >
                                <option value="">Select Treatment</option>
                                {treatmentOptions?.map((option) => (
                                    <option key={option._id} value={option._id}>{option.name}</option>
                                ))}
                            </select>
                            <label className="label" htmlFor={`volume-${index}`}>Volume</label>
                            <input
                                type="number"
                                className="input2"
                                name="volume"
                                value={treatment.volume}
                                onChange={(e) => handleTreatmentChange(e, index)}
                            />
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

export default TreatmentLocation;
