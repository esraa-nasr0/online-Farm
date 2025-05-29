import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import { IoIosSave } from "react-icons/io";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';  // إضافة import للترجمة

function Vaccinebyanimal() {
    const { t } = useTranslation();  // تفعيل الترجمة باستخدام useTranslation

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return {
            Authorization: formattedToken
        };
    };
    let navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            vaccineName: '',
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
                vaccineName: values.vaccineName,
                BoosterDose: values.BoosterDose,
                AnnualDose: values.AnnualDose,
                bottles: values.bottles,
                dosesPerBottle: values.dosesPerBottle,
                bottlePrice: values.bottlePrice,
                expiryDate:values.expiryDate
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
                    console.log('API Response:', response.data);
                }
                console.log(response);
                
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
        <>
            <div className=' container'>
                <div className="big-card" style={{
                    width: '100%',
                    borderRadius: '15px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                }}>
                    <div className="container mx-auto pb-3">
                        <div className="title2" style={{paddingTop:"15px"}}>{t("Add Vaccine")}</div>
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
                                <div className="input-box">
                                    <label className="label" htmlFor="vaccineName">{t("Vaccine Name")}</label>
                                    <input
                                        id="vaccineName"
                                        name="vaccineName"
                                        type="text"
                                        className="input2"
                                        placeholder={t("Enter vaccine name")}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.vaccineName}
                                    />
                                </div>

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
                                </div>

                                <div className="input-box">
                                    <label className="label" htmlFor="locationShed">{t("Annual Dose")}</label>
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
                                </div>

                                <div className="input-box">
                                    <label className="label" htmlFor="bottles">{t("Bottles")}</label>
                                    <input
                                        id="bottles"
                                        name="bottles"
                                        placeholder={t("Enter Number Of Bottles")}
                                        type="text"
                                        className="input2"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.bottles}
                                    />
                                </div>

                                <div className="input-box">
                                    <label className="label" htmlFor="dosesPerBottle">{t("Doses Per Bottle")}</label>
                                    <input
                                        id="dosesPerBottle"
                                        name="dosesPerBottle"
                                        placeholder={t("Enter Doses Per Bottle")}
                                        type="text"
                                        className="input2"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.dosesPerBottle}
                                    />
                                </div>

                                <div className="input-box">
                                    <label className="label" htmlFor="bottlePrice">{t("Bottle Price")}</label>
                                    <input
                                        id="bottlePrice"
                                        name="bottlePrice"
                                        placeholder={t("Enter Bottle Price")}
                                        type="text"
                                        className="input2"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.bottlePrice}
                                    />
                                </div>

                                
                                <div className="input-box">
                                    <label className="label" htmlFor="expiryDate">Expiry Date</label>
                                    <input
                                        id="expiryDate"
                                        name="expiryDate"
                                        placeholder={t("Enter Bottle Price")}
                                        type="date"
                                        className="input2"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.expiryDate}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Vaccinebyanimal;
