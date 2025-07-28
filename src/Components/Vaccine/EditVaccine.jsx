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

    const [vaccinename, setvaccinename] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        return {
            Authorization: Authorization?.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`,
            'Content-Type': 'application/json',
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchVaccinename();
                await fetchVaccineData();
                setIsDataLoaded(true);
            } catch (error) {
                setError(t("Failed to load data"));
            }
        };
        fetchData();
    }, [id]);

    const fetchVaccinename = async () => {
        try {
            const res = await getVaccinename(1, 100);
            const vaccines = res.data?.data?.vaccines || [];

            const uniqueTypes = Array.from(
                new Map(
                    vaccines.map(v => [v.vaccineType._id, v.vaccineType])
                ).values()
            );

            setvaccinename(uniqueTypes);
        } catch (error) {
            setError(t("Failed to fetch vaccine types"));
            setvaccinename([]);
        }
    };

    const vaccineOptions = vaccinename?.map(item => ({
        value: item._id,
        label: i18n.language === "ar" ? item.arabicName : item.englishName,
        image: item.image ? `https://farm-project-bbzj.onrender.com/${item.image.replace(/\\/g, "/")}` : '',
    })) || [];

    const formik = useFormik({
        initialValues: {
            vaccineTypeId: '',
            BoosterDose: '',
            AnnualDose: '',
            bottles: '',
            dosesPerBottle: '',
            bottlePrice: '',
            expiryDate: '',
        },
        validationSchema: Yup.object({
            vaccineTypeId: Yup.string().required(t("Vaccine type is required")),
            BoosterDose: Yup.number().required(t("Booster dose is required")),
            AnnualDose: Yup.number().required(t("Annual dose is required")),
            bottles: Yup.number().required(t("Bottles count is required")),
            dosesPerBottle: Yup.number().required(t("Doses per bottle is required")),
            bottlePrice: Yup.number().required(t("Bottle price is required")),
            expiryDate: Yup.string().required(t("Expiry date is required")),
        }),
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const response = await axios.patch(
                    `https://farm-project-bbzj.onrender.com/api/vaccine/UpdateVaccine/${id}`,
                    {
                        vaccineTypeId: values.vaccineTypeId,
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
                setError(err.response?.data?.message || t("An error occurred while updating data."));
                Swal.fire(t("Error"), error, "error");
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
            formik.setValues({
                vaccineTypeId: vaccine.vaccineType?._id || '',
                BoosterDose: vaccine.BoosterDose || '',
                AnnualDose: vaccine.AnnualDose || '',
                bottles: vaccine.stock?.bottles || '',
                dosesPerBottle: vaccine.stock?.dosesPerBottle || '',
                bottlePrice: vaccine.pricing?.bottlePrice || '',
                expiryDate: vaccine.expiryDate?.slice(0, 10) || '',
            });
        } catch (error) {
            setError(t("Failed to fetch vaccine details."));
        }
    };

    if (!isDataLoaded) {
        return <div className="loading-container">Loading...</div>;
    }

    if (error) {
        return <div className="error-container">Error: {error}</div>;
    }

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
                            <label htmlFor="vaccineTypeId">{t("Vaccine Name")}</label>
                            <Select
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
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                            {formik.errors.vaccineTypeId && formik.touched.vaccineTypeId && (
                                <p className="text-danger">{formik.errors.vaccineTypeId}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="BoosterDose">{t("BoosterDose")}</label>
                            <input
                                id="BoosterDose"
                                name="BoosterDose"
                                type="number"
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