import axios from 'axios';
import { useFormik } from 'formik';
import React, { useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { IoIosSave } from "react-icons/io";
import * as Yup from 'yup';
import { TreatmentContext } from '../../Context/TreatmentContext';
import { LocationContext } from '../../Context/LocationContext';
import { useTranslation } from 'react-i18next';
import './Treatment.css';
import { useNavigate } from 'react-router-dom';


function TreatmentLocation() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [locationSheds, setLocationSheds] = useState([]);
    const [treatmentOptions, setTreatmentOptions] = useState([]);
    
    const { getTreatmentMenue } = useContext(TreatmentContext);
    const { LocationMenue } = useContext(LocationContext);
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return { Authorization: formattedToken };
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
                    title: t('success'),
                    text: t('treatment_added_successfully'),
                    icon: 'success',
                    confirmButtonText: t('ok'),
                });
                navigate('/treatAnimalTable');
            } else {
                setIsLoading(false);
                setError(t('error_occurred'));
            }
        } catch (err) {
            console.error('Error occurred:', err);
            setIsLoading(false);
            setError(err.response?.data?.message || t('error_occurred'));
        }
    }
    
    // const validationSchema = Yup.object({
    //     locationShed: Yup.string().required(t('location_shed_required')),
    //     date: Yup.date().required(t('date_required')),
    //     treatments: Yup.array()
    //         .of(
    //             Yup.object({
    //                 treatmentId: Yup.string().required(t('treatment_id_required')),
    //                 volume: Yup.number()
    //                     .required(t('volume_required'))
    //                     .positive(t('volume_positive'))
    //                     .typeError(t('volume_valid_number')),
    //             })
    //         )
    //         .min(1, t('at_least_one_treatment')),
    // });

    const formik = useFormik({
        initialValues: {
            locationShed: "",
            treatments: [{ treatmentId: "", volume: "" }],
            date: "",
        },
        // validationSchema,
        onSubmit: submitTreatment,
    });

    const addTreat = () => {
        formik.setFieldValue('treatments', [
            ...formik.values.treatments,
            { treatmentId: '', volume: '' },
        ]);
    };

    const handleTreatmentChange = (e, index) => {
        const { name, value } = e.target;
        const updatedTreatments = [...formik.values.treatments];
        updatedTreatments[index][name] = name === 'volume' ? Number(value) : value;
        formik.setFieldValue('treatments', updatedTreatments);
    };

    return (
        <div className="treatment-container">
            <div className="treatment-header">
                <h1>{t('treatment_by_location')}</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={formik.handleSubmit} className="treatment-form">
                <div className="form-grid">
                    <div className="form-section">
                        <h2>{t('location_details')}</h2>
                        <div className="input-group">
                            <label htmlFor="locationShed">{t('location_shed')}</label>
                            <select
                                id="locationShed"
                                {...formik.getFieldProps('locationShed')}
                            >
                                <option value="">{t('select_location_shed')}</option>
                                {locationSheds?.map((shed) => (
                                    <option key={shed._id} value={shed._id}>
                                        {shed.locationShedName}
                                    </option>
                                ))}
                            </select>
                            {formik.errors.locationShed && formik.touched.locationShed && (
                                <p className="error-message">{formik.errors.locationShed}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="date">{t('date')}</label>
                            <input
                                id="date"
                                type="date"
                                {...formik.getFieldProps('date')}
                            />
                            {formik.errors.date && formik.touched.date && (
                                <p className="error-message">{formik.errors.date}</p>
                            )}
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>{t('treatments')}</h2>
                        {formik.values.treatments.map((treatment, index) => (
                            <div key={index} className="input-group">
                                <label htmlFor={`treatment-${index}`}>{t('treatment_name')}</label>
                                <select
                                    id={`treatment-${index}`}
                                    name="treatmentId"
                                    value={treatment.treatmentId}
                                    onChange={(e) => handleTreatmentChange(e, index)}
                                >
                                    <option value="">{t('select_treatment')}</option>
                                    {treatmentOptions?.map((option) => (
                                        <option key={option._id} value={option._id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                                {formik.errors.treatments?.[index]?.treatmentId && (
                                    <p className="error-message">{formik.errors.treatments[index].treatmentId}</p>
                                )}

                                <label htmlFor={`volume-${index}`}>{t('volume')}</label>
                                <input
                                    type="number"
                                    id={`volume-${index}`}
                                    name="volume"
                                    value={treatment.volume}
                                    onChange={(e) => handleTreatmentChange(e, index)}
                                    placeholder={t('enter_volume')}
                                />
                                {formik.errors.treatments?.[index]?.volume && (
                                    <p className="error-message">{formik.errors.treatments[index].volume}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={addTreat} className="add-treatment-button">
                        +
                    </button>
                    {isLoading ? (
                        <button type="submit" className="save-button" disabled>
                            <span className="loading-spinner"></span>
                        </button>
                    ) : (
                        <button type="submit" className="save-button">
                            <IoIosSave /> {t('save')}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default TreatmentLocation;
