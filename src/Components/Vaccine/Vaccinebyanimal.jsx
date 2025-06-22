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
        const res = await getVaccinename();
        setvaccinename(res.data.data.vaccineTypes);
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
        validationSchema: Yup.object({
            vaccineTypeId: Yup.string().required(t("Vaccine type is required")),
            BoosterDose: Yup.number().typeError(t("Must be a number")).required(t("Booster dose is required")),
            AnnualDose: Yup.number().typeError(t("Must be a number")).required(t("Annual dose is required")),
            bottles: Yup.number().typeError(t("Must be a number")).required(t("Bottles count is required")),
            dosesPerBottle: Yup.number().typeError(t("Must be a number")).required(t("Doses per bottle is required")),
            bottlePrice: Yup.number().typeError(t("Must be a number")).required(t("Bottle price is required")),
            expiryDate: Yup.string().required(t("Expiry date is required")),
        }),
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
        <div className='container'>
            <div className="big-card" style={{
                width: '100%',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            }}>
                <div className="container mx-auto pb-3">
                    <div className="title2" style={{ paddingTop: "15px" }}>{t("Add Vaccine")}</div>
                    <p className="text-danger">{error}</p>
                    <form onSubmit={formik.handleSubmit} className="mt-5">
                        {isLoading ? (
                            <button type="submit" className="btn button2" disabled>
                                <i className="fas fa-spinner fa-spin"></i>
                            </button>
                        ) : (
                            <button type="submit" className="btn button2">
                                <IoIosSave /> {t("Save")}
                            </button>
                        )}
                        <div className="animaldata">
                            {/* Vaccine Name with Image */}
                            <div className="input-box">
                                <label className="label" htmlFor="vaccineTypeId">{t("Vaccine Name")}</label>
                                <Select
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
                                />
                                {formik.errors.vaccineTypeId && formik.touched.vaccineTypeId && (
                                    <p className="text-danger">{formik.errors.vaccineTypeId}</p>
                                )}
                            </div>

                            {/* Booster Dose */}
                            <div className="input-box">
                                <label className="label" htmlFor="BoosterDose">{t("Booster Dose")}</label>
                                <input
                                    id="BoosterDose"
                                    name="BoosterDose"
                                    type="text"
                                    className="input2"
                                    placeholder={t("Enter Booster Dose")}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.BoosterDose}
                                />
                                {formik.errors.BoosterDose && formik.touched.BoosterDose && (
                                    <p className="text-danger">{formik.errors.BoosterDose}</p>
                                )}
                            </div>

                            {/* Annual Dose */}
                            <div className="input-box">
                                <label className="label" htmlFor="AnnualDose">{t("Annual Dose")}</label>
                                <input
                                    id="AnnualDose"
                                    name="AnnualDose"
                                    type="text"
                                    className="input2"
                                    placeholder={t("Enter Annual Dose")}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.AnnualDose}
                                />
                                {formik.errors.AnnualDose && formik.touched.AnnualDose && (
                                    <p className="text-danger">{formik.errors.AnnualDose}</p>
                                )}
                            </div>

                            {/* Bottles */}
                            <div className="input-box">
                                <label className="label" htmlFor="bottles">{t("Bottles")}</label>
                                <input
                                    id="bottles"
                                    name="bottles"
                                    type="text"
                                    className="input2"
                                    placeholder={t("Enter Number Of Bottles")}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.bottles}
                                />
                                {formik.errors.bottles && formik.touched.bottles && (
                                    <p className="text-danger">{formik.errors.bottles}</p>
                                )}
                            </div>

                            {/* Doses Per Bottle */}
                            <div className="input-box">
                                <label className="label" htmlFor="dosesPerBottle">{t("Doses Per Bottle")}</label>
                                <input
                                    id="dosesPerBottle"
                                    name="dosesPerBottle"
                                    type="text"
                                    className="input2"
                                    placeholder={t("Enter Doses Per Bottle")}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.dosesPerBottle}
                                />
                                {formik.errors.dosesPerBottle && formik.touched.dosesPerBottle && (
                                    <p className="text-danger">{formik.errors.dosesPerBottle}</p>
                                )}
                            </div>

                            {/* Bottle Price */}
                            <div className="input-box">
                                <label className="label" htmlFor="bottlePrice">{t("Bottle Price")}</label>
                                <input
                                    id="bottlePrice"
                                    name="bottlePrice"
                                    type="text"
                                    className="input2"
                                    placeholder={t("Enter Bottle Price")}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.bottlePrice}
                                />
                                {formik.errors.bottlePrice && formik.touched.bottlePrice && (
                                    <p className="text-danger">{formik.errors.bottlePrice}</p>
                                )}
                            </div>

                            {/* Expiry Date */}
                            <div className="input-box">
                                <label className="label" htmlFor="expiryDate">{t("Expiry Date")}</label>
                                <input
                                    id="expiryDate"
                                    name="expiryDate"
                                    type="date"
                                    className="input2"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.expiryDate}
                                />
                                {formik.errors.expiryDate && formik.touched.expiryDate && (
                                    <p className="text-danger">{formik.errors.expiryDate}</p>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Vaccinebyanimal;