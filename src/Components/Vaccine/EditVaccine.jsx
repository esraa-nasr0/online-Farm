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

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        return {
            Authorization: Authorization?.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`,
            'Content-Type': 'application/json',
        };
    };

    useEffect(() => {
        fetchVaccinename();
        fetchVaccineData();
    }, [id]);

    const fetchVaccinename = async () => {
        const res = await getVaccinename();
        setvaccinename(res.data.data.vaccineTypes);
    };

    const vaccineOptions = vaccinename.map(item => ({
        value: item._id,
        label: i18n.language === "ar" ? item.arabicName : item.englishName,
        image: `https://farm-project-bbzj.onrender.com/${item.image.replace(/\\/g, "/")}`,
    }));

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
            const vaccine = res.data.data.vaccine;
            formik.setValues({
                vaccineTypeId: vaccine.vaccineType?._id || '',
                BoosterDose: vaccine.BoosterDose,
                AnnualDose: vaccine.AnnualDose,
                bottles: vaccine.stock?.bottles,
                dosesPerBottle: vaccine.stock?.dosesPerBottle,
                bottlePrice: vaccine.pricing?.bottlePrice,
                expiryDate: vaccine.expiryDate?.slice(0, 10) || '',
            });
        } catch (error) {
            setError(t("Failed to fetch vaccine details."));
        }
    };

    return (
        <div className='container'>
            <div className="big-card">
                <div className="container mx-auto pb-3">
                    <div className="title2" style={{ paddingTop: "15px" }}>{t("Edit Vaccine")}</div>
                    <form onSubmit={formik.handleSubmit} className="mt-5">
                        <button type="submit" className="btn button2" disabled={isLoading}>
                            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <><IoIosSave /> {t("Save")}</>}
                        </button>
                        <div className="animaldata">
                            <div className="input-box">
                                <label className="label" htmlFor="vaccineTypeId">{t("Vaccine Name")}</label>
                                <Select
                                    name="vaccineTypeId"
                                    options={vaccineOptions}
                                    value={vaccineOptions.find(option => option.value === formik.values.vaccineTypeId)}
                                    onChange={(selected) => formik.setFieldValue("vaccineTypeId", selected?.value || '')}
                                    onBlur={() => formik.setFieldTouched("vaccineTypeId", true)}
                                    getOptionLabel={e => (
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <img src={e.image} alt={e.label} width="30" height="30" style={{ borderRadius: "5px", objectFit: "cover" }} />
                                            <span>{e.label}</span>
                                        </div>
                                    )}
                                />
                                {formik.errors.vaccineTypeId && formik.touched.vaccineTypeId && (
                                    <p className="text-danger">{formik.errors.vaccineTypeId}</p>
                                )}
                            </div>

                            {['BoosterDose', 'AnnualDose', 'bottles', 'dosesPerBottle', 'bottlePrice', 'expiryDate'].map((field, index) => (
                                <div className="input-box" key={index}>
                                    <label className="label" htmlFor={field}>{t(field)}</label>
                                    <input
                                        id={field}
                                        name={field}
                                        type={field === 'expiryDate' ? 'date' : 'text'}
                                        className="input2"
                                        placeholder={t("Enter") + ' ' + t(field)}
                                        value={formik.values[field]}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.errors[field] && formik.touched[field] && (
                                        <p className="text-danger">{formik.errors[field]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditVaccine;