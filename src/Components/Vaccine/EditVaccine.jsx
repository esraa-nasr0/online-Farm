import React, { useEffect, useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IoIosSave } from "react-icons/io";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { NewvaccineContext } from '../../Context/NewvaccineContext';

function EditVaccine() {
    const { i18n, t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { getVaccinename } = useContext(NewvaccineContext);

    const [vaccineTypes, setVaccineTypes] = useState([]);
    const [diseaseTypes, setDiseaseTypes] = useState([]);
    const [filteredVaccines, setFilteredVaccines] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        const token = Authorization?.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return {
            Authorization: token,
            'Content-Type': 'application/json',
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchVaccineTypes();
                await fetchVaccineData();
            } catch (err) {
                console.error("Error loading data:", err);
                setError(t("Failed to load data"));
            }
        };
        fetchData();
    }, [id]);

    const fetchVaccineTypes = async () => {
        try {
            const res = await getVaccinename(1, 100);
            const vaccines = res.data?.data || [];

            if (Array.isArray(vaccines)) {
                setVaccineTypes(vaccines);
                
                // Extract unique disease types
                const diseaseTypesArray = vaccines.map(v => 
                    i18n.language === "ar" ? v.arabicDiseaseType : v.englishDiseaseType
                );
                const uniqueDiseaseTypes = [...new Set(diseaseTypesArray)];
                
                setDiseaseTypes(uniqueDiseaseTypes);
                setFilteredVaccines(vaccines);
            }
        } catch (error) {
            console.error("Error fetching vaccine types:", error);
            setError(t("Failed to fetch vaccine types"));
            setVaccineTypes([]);
            setDiseaseTypes([]);
            setFilteredVaccines([]);
        }
    };

    const handleDiseaseTypeChange = (selectedDisease) => {
        if (!selectedDisease) {
            setFilteredVaccines(vaccineTypes);
            return;
        }
        
        const filtered = vaccineTypes.filter(v => 
            i18n.language === "ar" 
                ? v.arabicDiseaseType === selectedDisease
                : v.englishDiseaseType === selectedDisease
        );
        
        setFilteredVaccines(filtered);
        formik.setFieldValue('vaccineTypeId', '');
    };

    const diseaseTypeOptions = diseaseTypes.map(disease => ({
        value: disease,
        label: disease
    }));

    const vaccineOptions = filteredVaccines.map(item => ({
        value: item._id,
        label: i18n.language === "ar" ? item.arabicName : item.englishName,
        image: item.image ? `https://farm-project-bbzj.onrender.com/${item.image.replace(/\\/g, "/")}` : '',
    }));

    const formik = useFormik({
        initialValues: {
            diseaseType: '',
            vaccineTypeId: '',
            otherVaccineName: '',
            BoosterDose: '',
            AnnualDose: '',
            bottles: '',
            dosesPerBottle: '',
            bottlePrice: '',
            expiryDate: '',
        },
       
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const response = await axios.patch(
                    `https://farm-project-bbzj.onrender.com/api/vaccine/UpdateVaccine/${id}`,
                    {
                        diseaseType: values.diseaseType,
                        vaccineTypeId: values.vaccineTypeId,
                        otherVaccineName: values.otherVaccineName,
                        BoosterDose: values.BoosterDose,
                        AnnualDose: values.AnnualDose,
                        bottles: values.bottles,
                        dosesPerBottle: values.dosesPerBottle,
                        bottlePrice: values.bottlePrice,
                        expiryDate: values.expiryDate,
                    },
                    { headers: getHeaders() }
                );
                if (response.data.status === "success") {
                    Swal.fire(t("Success"), t("Vaccine updated successfully"), "success")
                        .then(() => navigate('/vaccineTable'));
                }
            } catch (err) {
                console.error("Update error:", err);
                const msg = err.response?.data?.message || t("An error occurred while updating data.");
                setError(msg);
                Swal.fire(t("Error"), msg, "error");
            } finally {
                setIsLoading(false);
            }
        }
    });

    const fetchVaccineData = async () => {
        try {
            const res = await axios.get(
                `https://farm-project-bbzj.onrender.com/api/vaccine/GetSingleVaccine/${id}`,
                { headers: getHeaders() }
            );
            const vaccine = res.data?.data?.vaccine || {};
            
            // Find the disease type for the current vaccine
            const currentVaccineType = vaccineTypes.find(v => v._id === vaccine.vaccineType?._id);
            const currentDiseaseType = currentVaccineType ? 
                (i18n.language === "ar" ? currentVaccineType.arabicDiseaseType : currentVaccineType.englishDiseaseType) : 
                '';
            
            formik.setValues({
                diseaseType: vaccine.diseaseType || currentDiseaseType || '',
                vaccineTypeId: vaccine.vaccineType?._id || '',
                otherVaccineName: vaccine.otherVaccineName || '',
                BoosterDose: vaccine.BoosterDose || '',
                AnnualDose: vaccine.AnnualDose || '',
                bottles: vaccine.stock?.bottles || '',
                dosesPerBottle: vaccine.stock?.dosesPerBottle || '',
                bottlePrice: vaccine.pricing?.bottlePrice || '',
                expiryDate: vaccine.expiryDate?.slice(0, 10) || '',
            });
        } catch (error) {
            console.error("Fetch vaccine details error:", error);
            setError(t("Failed to fetch vaccine details."));
        }
    };

    return (
        <div className="animal-details-container">
            <div className="animal-details-header">
                <h1>{t("Edit Vaccine")}</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={formik.handleSubmit} className="animal-form">
                <div className="form-grid">
                    <div className="form-section">
                        <h2>{t("Vaccine Information")}</h2>

                        <div className="input-group">
                            <label htmlFor="diseaseType">{t("Disease Type")}</label>
                            <Select
                                id="diseaseType"
                                name="diseaseType"
                                options={diseaseTypeOptions}
                                value={diseaseTypeOptions.find(option => option.value === formik.values.diseaseType)}
                                onChange={(selectedOption) => {
                                    handleDiseaseTypeChange(selectedOption?.value);
                                    formik.setFieldValue('diseaseType', selectedOption?.value || '');
                                }}
                                onBlur={() => formik.setFieldTouched('diseaseType', true)}
                                isClearable
                                placeholder={t("Select Disease Type")}
                                classNamePrefix="react-select"
                                className="react-select-container"
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="vaccineTypeId">{t("Vaccine Name")}</label>
                            <Select
                                id="vaccineTypeId"
                                name="vaccineTypeId"
                                options={vaccineOptions}
                                value={vaccineOptions.find(option => option.value === formik.values.vaccineTypeId)}
                                onChange={(selected) => formik.setFieldValue("vaccineTypeId", selected?.value || '')}
                                onBlur={() => formik.setFieldTouched("vaccineTypeId", true)}
                                getOptionLabel={e => (
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        {e.image && <img src={e.image} alt={e.label} width="30" height="30" style={{ borderRadius: "5px", objectFit: "cover" }} />}
                                        <span>{e.label}</span>
                                    </div>
                                )}
                                classNamePrefix="react-select"
                                className="react-select-container"
                                placeholder={filteredVaccines.length === 0 ? t("No vaccines available") : t("Select Vaccine")}
                                isDisabled={filteredVaccines.length === 0}
                            />
                            {formik.errors.vaccineTypeId && formik.touched.vaccineTypeId && (
                                <p className="text-danger">{formik.errors.vaccineTypeId}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="otherVaccineName">{t("Other Vaccine Name")}</label>
                            <input
                                id="otherVaccineName"
                                name="otherVaccineName"
                                type="text"
                                value={formik.values.otherVaccineName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder={t("Enter Other Vaccine Name")}
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="BoosterDose">{t("BoosterDose")}</label>
                            <input
                                id="BoosterDose"
                                name="BoosterDose"
                                type="number"
                                min="0"
                                value={formik.values.BoosterDose}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder={t("Enter Booster Dose")}
                            />
                            {formik.errors.BoosterDose && formik.touched.BoosterDose && (
                                <p className="text-danger">{formik.errors.BoosterDose}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="AnnualDose">{t("AnnualDose")}</label>
                            <input
                                id="AnnualDose"
                                name="AnnualDose"
                                type="number"
                                min="0"
                                value={formik.values.AnnualDose}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder={t("Enter Annual Dose")}
                            />
                            {formik.errors.AnnualDose && formik.touched.AnnualDose && (
                                <p className="text-danger">{formik.errors.AnnualDose}</p>
                            )}
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>{t("Stock Information")}</h2>

                        <div className="input-group">
                            <label htmlFor="bottles">{t("bottles")}</label>
                            <input
                                id="bottles"
                                name="bottles"
                                type="number"
                                min="0"
                                value={formik.values.bottles}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder={t("Enter Bottles Count")}
                            />
                            {formik.errors.bottles && formik.touched.bottles && (
                                <p className="text-danger">{formik.errors.bottles}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="dosesPerBottle">{t("dosesPerBottle")}</label>
                            <input
                                id="dosesPerBottle"
                                name="dosesPerBottle"
                                type="number"
                                min="0"
                                value={formik.values.dosesPerBottle}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder={t("Enter Doses Per Bottle")}
                            />
                            {formik.errors.dosesPerBottle && formik.touched.dosesPerBottle && (
                                <p className="text-danger">{formik.errors.dosesPerBottle}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="bottlePrice">{t("bottlePrice")}</label>
                            <input
                                id="bottlePrice"
                                name="bottlePrice"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formik.values.bottlePrice}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
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
                            <label htmlFor="expiryDate">{t("expiryDate")}</label>
                            <input
                                id="expiryDate"
                                name="expiryDate"
                                type="date"
                                value={formik.values.expiryDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
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

export default EditVaccine;