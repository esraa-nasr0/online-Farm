import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";
import { IoIosSave } from "react-icons/io";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Breeding() {
    const { t } = useTranslation();
    const [numberOfBirths, setNumberOfBirths] = useState(1);
    const [birthEntries, setBirthEntries] = useState([{ tagId: "", gender: "", birthweight: "" }]);
    const [isLoading, setIsLoading] = useState(false);
    const { Authorization } = useContext(UserContext);
    const navigate = useNavigate();

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return { Authorization: formattedToken };
    };

    async function handleSubmit(values) {
        const headers = getHeaders(); 
        try {
            setIsLoading(true);
            const dataToSubmit = { ...values, birthEntries };

            const { data } = await axios.post(
                "https://farm-project-bbzj.onrender.com/api/breeding/AddBreeding",
                dataToSubmit,
                { headers }
            );

            if (data.status === "success") {
                Swal.fire({
                    title: t("successTitle"),
                    text: t("successMessage"),
                    icon: "success",
                    confirmButtonText: t("OK")
                }).then(() => navigate('/breadingTable'));
            }
        } catch (err) {
            Swal.fire({
                title: t("errorTitle"),
                text: err.response?.data?.message || t("submitError"),
                icon: "error",
                confirmButtonText: t("OK")
            });
        } finally {
            setIsLoading(false);
        }
    }

    const validationSchema = Yup.object({
        tagId: Yup.string().required(t("tagIdRequired")),
        deliveryState: Yup.string().required(t("deliveryStateRequired")).max(50, t("deliveryStateMax")),
        deliveryDate: Yup.date().required(t("deliveryDateRequired")).typeError(t("invalidDate")),
        numberOfBirths: Yup.number().required(t("numberOfBirthsRequired")).min(1, t("minBirths")).max(4, t("maxBirths")),
        milking: Yup.string().required(t("milkingRequired"))
    });

    const formik = useFormik({
        initialValues: { tagId: "", deliveryState: "", deliveryDate: "", numberOfBirths: 1, milking: '', motheringAbility: "" },
        validationSchema,
        onSubmit: handleSubmit
    });

    function handleNumberOfBirthsChange(e) {
        const newNumberOfBirths = Math.max(1, Math.min(4, parseInt(e.target.value, 10) || 1));
        setNumberOfBirths(newNumberOfBirths);

        setBirthEntries((prev) => {
            const newEntries = prev.slice(0, newNumberOfBirths);
            while (newEntries.length < newNumberOfBirths) {
                newEntries.push({ tagId: "", gender: "", birthweight: "" });
            }
            return newEntries;
        });

        formik.setFieldValue("numberOfBirths", newNumberOfBirths);
    }

    function handleBirthEntriesChange(e, index) {
        const { name, value } = e.target;
        setBirthEntries((prevEntries) => {
            const updatedEntries = [...prevEntries];
            updatedEntries[index][name] = value;
            return updatedEntries;
        });
    }

    return (
        <div className="container">
            <div className="title2">{t("breedingTitle")}</div>
            <form onSubmit={formik.handleSubmit} className="mt-5">
                {isLoading ? (
                    <button type="submit" className="btn button2" disabled>
                        <i className="fas fa-spinner fa-spin"></i>
                    </button>
                ) : (
                    <button type="submit" className="btn button2">
                        <IoIosSave /> {t("save")}
                    </button>
                )}

                <div className="animaldata">
                    <div className="input-box">
                        <label className="label" htmlFor="tagId">{t("tagId")}</label>
                        <input {...formik.getFieldProps("tagId")} placeholder={t("Enter Tag Id")} id="tagId" type="text" className="input2" />
                        {formik.touched.tagId && formik.errors.tagId && <p className="text-danger">{formik.errors.tagId}</p>}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="deliveryState">{t("Delivery State")}</label>
                        <input {...formik.getFieldProps("deliveryState")} placeholder={t("Enter your delivery state")} id="deliveryState" type="text" className="input2" />
                        {formik.touched.deliveryState && formik.errors.deliveryState && <p className="text-danger">{formik.errors.deliveryState}</p>}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="deliveryDate">{t("Delivery Date")}</label>
                        <input {...formik.getFieldProps("deliveryDate")} placeholder={t("Enter your delivery date")} id="deliveryDate" type="date" className="input2" />
                        {formik.touched.deliveryDate && formik.errors.deliveryDate && <p className="text-danger">{formik.errors.deliveryDate}</p>}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="numberOfBirths">{t("Number Of Births")}</label>
                        <input value={numberOfBirths} onChange={handleNumberOfBirthsChange} placeholder={t("Enter Birth Weight")} id="numberOfBirths" type="number" className="input2" name="numberOfBirths" />
                        {formik.touched.numberOfBirths && formik.errors.numberOfBirths && <p className="text-danger">{formik.errors.numberOfBirths}</p>}
                    </div>

                    {birthEntries.map((entry, index) => (
                        <div key={index} className="input-box">
                            <label className="label" htmlFor={`tagId-${index}`}>{t("Calf Tag ID")} {index + 1}</label>
                            <input value={entry.tagId} onChange={(e) => handleBirthEntriesChange(e, index)} placeholder={t("Enter Calf Tag ID")} id={`tagId-${index}`} name="tagId" type="text" className="input2" />

                            <label className="label" htmlFor={`gender-${index}`}>{t("Gender")} {index + 1}</label>
                            <input value={entry.gender} onChange={(e) => handleBirthEntriesChange(e, index)} placeholder={t("Enter Gender")} id={`gender-${index}`} name="gender" type="text" className="input2" />

                            <label className="label" htmlFor={`birthweight-${index}`}>{t("Birth Weight")} {index + 1}</label>
                            <input value={entry.birthweight} onChange={(e) => handleBirthEntriesChange(e, index)} placeholder={t("Enter Birth Weight")} id={`birthweight-${index}`} name="birthweight" type="number" className="input2" />
                        </div>
                    ))}

                    <div className="input-box">
                        <label className="label" htmlFor="milking">{t("Milking")}</label>
                        <select
                            id="milking"
                            name="milking"
                            className="input2"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.milking}
                        >
                            <option value="">{t("Select milking")}</option>
                            <option value="no milk">{t("No Milk")}</option>
                            <option value="one teat">{t("One Teat")}</option>
                            <option value="two teat">{t("Two Teat")}</option>
                        </select>
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="motheringAbility">{t("Mothering Ability")}</label>
                        <select
                            id="motheringAbility"
                            name="motheringAbility"
                            className="input2"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.motheringAbility}
                        >
                            <option value="good">{t("Good")}</option>
                            <option value="bad">{t("Bad")}</option>
                            <option value="medium">{t("Medium")}</option>
                        </select>
                    </div>

                </div>
            </form>
        </div>
    );
}
