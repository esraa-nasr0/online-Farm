import { useFormik } from "formik";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { IoIosSave } from "react-icons/io";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import './LocationShed.css';

function EditLocation() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams(); 
    const { t } = useTranslation();
    const navigate = useNavigate();

    const getHeaders = () => {
        const Authorization = localStorage.getItem("Authorization");
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return { Authorization: formattedToken };
    };

    async function fetchLocation() {
        try {
            const headers = getHeaders();
            let { data } = await axios.get(
                `https://api.mazraaonline.com/api/location/GetSingle-Locationshed/${id}`,
                { headers }
            );
            if (data.status === "success") {
                formik.setValues({
                    locationShedName: data.data.locationShed.locationShedName || "",
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch location data");
        }
    }

    async function submitWeight(values) {
        const headers = getHeaders();
        setIsLoading(true);
        setError(null);

        try {
            let { data } = await axios.patch(
                `https://api.mazraaonline.com/api/location/updatelocationShed/${id}`,
                values,
                { headers }
            );

            if (data.status === "success") {
                setIsLoading(false);
                Swal.fire({
                    title: t("success"),
                    text: t("location_updated_successfully"),
                    icon: "success",
                    confirmButtonText: "OK",
                });
                navigate("/locationTable");
            }
        } catch (err) {
            setIsLoading(false);
            setError(err.response?.data?.message || "An error occurred");
        }
    }

    let formik = useFormik({
        initialValues: {
            locationShedName: "",
        },
        validationSchema: Yup.object({
            locationShedName: Yup.string().required("Location Shed is required"),
        }),
        onSubmit: submitWeight,
    });

    useEffect(() => {
        fetchLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <div className="animal-details-container ">
            <div className="animal-details-header container">
                <h1>{t('location_shed')}</h1>
            </div>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={formik.handleSubmit} className="animal-form container">
                <div className="form-grid">
                    <div className="form-section">
                        <div className="input-group">
                            <label className="label" htmlFor="locationShedName">
                                {t('location_shed')}
                            </label>
                            <input
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.locationShedName}
                                placeholder={t("enter_location_shed")}
                                id="locationShedName"
                                type="text"
                                className="input2"
                                name="locationShedName"
                            />
                            {formik.errors.locationShedName && formik.touched.locationShedName && (
                                <p className="text-danger">{formik.errors.locationShedName}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="form-actions">
                    <button type="submit" className="save-button" disabled={isLoading}>
                        {isLoading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            <><IoIosSave /> {t('save')}</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditLocation;
