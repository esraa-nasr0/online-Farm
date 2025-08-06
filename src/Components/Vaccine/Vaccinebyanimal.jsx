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
    const [diseaseTypes, setDiseaseTypes] = useState([]);
    const [filteredVaccines, setFilteredVaccines] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [isSubmitted, setIsSubmitted] = useState(false);


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
        const vaccines = res?.data?.data;

        if (Array.isArray(vaccines)) {
            setvaccinename(vaccines);
            
            // Extract disease types array first
            const diseaseTypesArray = vaccines.map(v => 
                i18n.language === "ar" ? v.arabicDiseaseType : v.englishDiseaseType
            );
            
            // Then get unique values
            const uniqueDiseaseTypes = [...new Set(diseaseTypesArray)];
            
            setDiseaseTypes(uniqueDiseaseTypes);
            setFilteredVaccines(vaccines); // Initially show all vaccines
        } else {
            setvaccinename([]);
            setDiseaseTypes([]);
            setFilteredVaccines([]);
            console.warn("Unexpected data format:", res.data);
        }
    } catch (error) {
        console.error("Error fetching vaccine names:", error);
        setError(t("Failed to load vaccine names"));
        setvaccinename([]);
        setDiseaseTypes([]);
        setFilteredVaccines([]);
    }
}

    const handleDiseaseTypeChange = (selectedDisease) => {
        if (!selectedDisease) {
            setFilteredVaccines(vaccinename);
            return;
        }
        
        const filtered = vaccinename.filter(v => 
            i18n.language === "ar" 
                ? v.arabicDiseaseType === selectedDisease
                : v.englishDiseaseType === selectedDisease
        );
        
        setFilteredVaccines(filtered);
        formik.setFieldValue('vaccineTypeId', ''); // Reset vaccine selection when disease type changes
    };

    const vaccineOptions = filteredVaccines.map((item) => ({
        value: item._id,
        label: i18n.language === "ar" ? item.arabicName : item.englishName,
        image: `https://farm-project-bbzj.onrender.com/${item.image.replace(/\\/g, "/")}`,
    }));

    const diseaseTypeOptions = diseaseTypes.map(disease => ({
        value: disease,
        label: disease
    }));

    const formik = useFormik({
        initialValues: {
            diseaseType: '',
            vaccineTypeId: "",
            otherVaccineName: '',
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
                otherVaccineName: values.otherVaccineName,
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
                    setIsSubmitted(true); // ✅ خلي الزر يظهر
                    Swal.fire({
                        title: t("Success"),
                        text: t("Data has been submitted successfully!"),
                        icon: "success",
                        confirmButtonText: t("OK"),
                    })
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
                        
                        {/* Disease Type Select Input */}
                        <div className="input-group">
                            <label htmlFor="diseaseType">{t("Disease Type")}</label>
                            <Select
                                id="diseaseType"
                                name="diseaseType"
                                options={diseaseTypeOptions}
                                onChange={(selectedOption) => {
                                    handleDiseaseTypeChange(selectedOption?.value);
                                    formik.setFieldValue('diseaseType', selectedOption?.value || "");
                                }}
                                onBlur={() => formik.setFieldTouched('diseaseType', true)}
                                isClearable
                                placeholder={t("Select Disease Type")}
                                classNamePrefix="react-select"
                                className="react-select-container"
                            />
                        </div>
                        
                        {/* Vaccine Name Select Input */}
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
                                placeholder={filteredVaccines.length === 0 ? t("No vaccines available for selected disease type") : t("Select Vaccine")}
                                isDisabled={filteredVaccines.length === 0}
                            />
                            {formik.errors.vaccineTypeId && formik.touched.vaccineTypeId && (
                                <p className="text-danger">{formik.errors.vaccineTypeId}</p>
                            )}
                        </div>

                        {/* Rest of your form fields remain the same */}
                        <div className="input-group">
                            <label htmlFor="otherVaccineName">{t("Other Vaccine Name")}</label>
                            <input
                                id="otherVaccineName"
                                name="otherVaccineName"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.otherVaccineName}
                                placeholder={t("Enter Other Vaccine Name")}
                            />
                            {formik.errors.otherVaccineName && formik.touched.otherVaccineName && (
                                <p className="text-danger">{formik.errors.otherVaccineName}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="BoosterDose">{t("Booster Dose (Days)")}</label>
                            <input
                                id="BoosterDose"
                                name="BoosterDose"
                                type="number"
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
                            <label htmlFor="AnnualDose">{t("Annual Dose (Months)")}</label>
                            <input
                                id="AnnualDose"
                                name="AnnualDose"
                                type="number"
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
                    {isSubmitted && (
    <button
        type="button"
        className="save-button"
        onClick={() => {
            formik.resetForm();
            setIsSubmitted(false);
        }}
    >
        {t("Add New Vaccine")}
    </button>
)}

                </div>
            </form>
        </div>
    );
}

export default Vaccinebyanimal;