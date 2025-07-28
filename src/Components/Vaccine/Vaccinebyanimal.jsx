import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IoIosSave } from "react-icons/io";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { NewvaccineContext } from '../../Context/NewvaccineContext';
import Select from 'react-select';
import "./Vaccinebyanimal.css";

function Vaccinebyanimal() {
    const { i18n, t } = useTranslation();
    const { getVaccinename } = useContext(NewvaccineContext);
    const [vaccinename, setvaccinename] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        const formattedToken = Authorization?.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return {
            Authorization: formattedToken
        };
    };

    useEffect(() => {
        fetchVaccinename();
    }, []);

    async function fetchVaccinename() {
        try {
            const res = await getVaccinename();
            const vaccines = res?.data?.data?.vaccines;

            if (Array.isArray(vaccines)) {
                const types = vaccines
                    .map(v => v.vaccineType)
                    .filter(v => v && v._id);

                setvaccinename(types);
            } else {
                setvaccinename([]);
                console.warn("Unexpected data format:", res.data);
            }
        } catch (error) {
            console.error("Error fetching vaccine names:", error);
            setError(t("Failed to load vaccine names"));
            setvaccinename([]);
        }
    }

    const vaccineOptions = vaccinename.map((item) => ({
        value: item._id,
        label: i18n.language === "ar" ? item.arabicName : item.englishName,
        image: `https://farm-project-bbzj.onrender.com/${item.image.replace(/\\/g, "/")}`,
    }));

    const formik = useFormik({
        initialValues: {
            vaccineTypeId: "",
            BoosterDose: '',
            AnnualDose: '',
            bottles: '',
            dosesPerBottle: '',
            bottlePrice: '',
            expiryDate: '',
        },
        
        onSubmit: async (values) => {
            const headers = getHeaders();
            setIsLoading(true);

            const dataToSend = {
                vaccineTypeId: values.vaccineTypeId,
                BoosterDose: Number(values.BoosterDose),
                AnnualDose: Number(values.AnnualDose),
                bottles: Number(values.bottles),
                dosesPerBottle: Number(values.dosesPerBottle),
                bottlePrice: Number(values.bottlePrice),
                expiryDate: values.expiryDate
            };

            try {
                const response = await axios.post(
                    'https://farm-project-bbzj.onrender.com/api/vaccine/AddVaccine',
                    dataToSend,
                    { headers }
                );

                if (response.data.status === "success") {
                    Swal.fire({
                        title: t("Success"),
                        text: t("Data has been submitted successfully!"),
                        icon: "success",
                        confirmButtonText: t("OK"),
                    }).then(() => navigate('/vaccineTable'));
                }
            } catch (err) {
                Swal.fire({
                    title: t("Error"),
                    text: err.response?.data?.message || t("An error occurred while submitting data."),
                    icon: "error",
                    confirmButtonText: t("OK"),
                });
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <div className="animal-details-container">
            <div className="animal-details-header">
                <h1>{t("Add Vaccine")}</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={formik.handleSubmit} className="animal-form">
                <div className="form-grid">
                    <div className="form-section">
                        <h2>{t("Vaccine Information")}</h2>
                        
                        <div className="input-group">
                            <label htmlFor="vaccineTypeId">{t("Vaccine Name")}</label>
                            <Select
                                id="vaccineTypeId"
                                name="vaccineTypeId"
                                options={vaccineOptions}
                                onChange={(selectedOption) =>
                                    formik.setFieldValue('vaccineTypeId', selectedOption?.value || "")
                                }
                                onBlur={() => formik.setFieldTouched('vaccineTypeId', true)}
                                getOptionLabel={(e) => (
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        direction: i18n.language === "ar" ? "rtl" : "ltr"
                                    }}>
                                        <img
                                            src={e.image}
                                            alt={e.label}
                                            width="30"
                                            height="30"
                                            style={{ borderRadius: "5px", objectFit: "cover" }}
                                        />
                                        <span>{e.label}</span>
                                    </div>
                                )}
                                classNamePrefix="react-select"
                                className="react-select-container"
                            />
                            {formik.errors.vaccineTypeId && formik.touched.vaccineTypeId && (
                                <p className="text-danger">{formik.errors.vaccineTypeId}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="BoosterDose">{t("Booster Dose")}</label>
                            <input
                                id="BoosterDose"
                                name="BoosterDose"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.BoosterDose}
                                placeholder={t("Enter Booster Dose")}
                            />
                            {formik.errors.BoosterDose && formik.touched.BoosterDose && (
                                <p className="text-danger">{formik.errors.BoosterDose}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="AnnualDose">{t("Annual Dose")}</label>
                            <input
                                id="AnnualDose"
                                name="AnnualDose"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.AnnualDose}
                                placeholder={t("Enter Annual Dose")}
                            />
                            {formik.errors.AnnualDose && formik.touched.AnnualDose && (
                                <p className="text-danger">{formik.errors.AnnualDose}</p>
                            )}
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>{t("Inventory Details")}</h2>
                        
                        <div className="input-group">
                            <label htmlFor="bottles">{t("Bottles")}</label>
                            <input
                                id="bottles"
                                name="bottles"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.bottles}
                                placeholder={t("Enter Bottles Count")}
                            />
                            {formik.errors.bottles && formik.touched.bottles && (
                                <p className="text-danger">{formik.errors.bottles}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="dosesPerBottle">{t("Doses Per Bottle")}</label>
                            <input
                                id="dosesPerBottle"
                                name="dosesPerBottle"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.dosesPerBottle}
                                placeholder={t("Enter Doses Per Bottle")}
                            />
                            {formik.errors.dosesPerBottle && formik.touched.dosesPerBottle && (
                                <p className="text-danger">{formik.errors.dosesPerBottle}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="bottlePrice">{t("Bottle Price")}</label>
                            <input
                                id="bottlePrice"
                                name="bottlePrice"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.bottlePrice}
                                placeholder={t("Enter Bottle Price")}
                            />
                            {formik.errors.bottlePrice && formik.touched.bottlePrice && (
                                <p className="text-danger">{formik.errors.bottlePrice}</p>
                            )}
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>{t("Expiry Information")}</h2>
                        
                        <div className="input-group">
                            <label htmlFor="expiryDate">{t("Expiry Date")}</label>
                            <input
                                id="expiryDate"
                                name="expiryDate"
                                type="date"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.expiryDate}
                            />
                            {formik.errors.expiryDate && formik.touched.expiryDate && (
                                <p className="text-danger">{formik.errors.expiryDate}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="save-button"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            <>
                                <IoIosSave /> {t("Save")}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Vaccinebyanimal;