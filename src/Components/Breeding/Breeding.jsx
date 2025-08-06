import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { IoIosSave } from "react-icons/io";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import './Breeding.css';

export default function Breeding() {
    const { t } = useTranslation();
    const [numberOfBirths, setNumberOfBirths] = useState(1);
    const [birthEntries, setBirthEntries] = useState([{ tagId: "", gender: "male", birthweight: "" }]); // Set default gender to "male"
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [isSubmitted, setIsSubmitted] = useState(false);


    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        return Authorization ? { Authorization: Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}` } : {};
    };

    async function handleSubmit(values) {
        const headers = getHeaders();
        setIsLoading(true);
        setError(null);
        try {
            const dataToSubmit = { 
                ...values, 
                birthEntries: birthEntries.map(entry => ({
                    ...entry,
                    birthweight: entry.birthweight ? parseFloat(entry.birthweight) : 0
                }))
            };
            const { data } = await axios.post(
                `https://farm-project-bbzj.onrender.com/api/breeding/AddBreeding`,
                dataToSubmit,
                { headers }
            );

            if (data.status === "success") {
                setIsSubmitted(true);
                Swal.fire({
                    title: t("success"),
                    text: t("breeding_added_successfully"),
                    icon: "success",
                    confirmButtonText: t("ok")
                })
            }
        } catch (err) {
            setError(err.response?.data?.message || t("error_occurred"));
            Swal.fire({
                title: t("error"),
                text: err.response?.data?.message || t("error_occurred"),
                icon: "error",
                confirmButtonText: t("ok")
            });
        } finally {
            setIsLoading(false);
        }
    }

    const validationSchema = Yup.object({
        tagId: Yup.string().required(t("tag_id_required")),
        deliveryState: Yup.string().required(t("delivery_state_required")),
        deliveryDate: Yup.date().required(t("delivery_date_required")),
        numberOfBirths: Yup.number().required(t("number_of_births_required")).min(1, t("min_births")).max(4, t("max_births")),
        milking: Yup.string().required(t("milking_required")),
        motheringAbility: Yup.string().required(t("mothering_ability_required")) // Added validation
    });

    const formik = useFormik({
        initialValues: {
            tagId: "",
            deliveryState: "",
            deliveryDate: "",
            numberOfBirths: 1,
            milking: '',
            motheringAbility: "good" // Set default value to match your first option
        },
        validationSchema,
        onSubmit: handleSubmit
    });

    function handleNumberOfBirthsChange(e) {
        const newNumberOfBirths = Math.max(1, Math.min(4, parseInt(e.target.value, 10) || 1));
        setNumberOfBirths(newNumberOfBirths);
        setBirthEntries((prev) => {
            const newEntries = prev.slice(0, newNumberOfBirths);
            while (newEntries.length < newNumberOfBirths) {
                newEntries.push({ tagId: "", gender: "male", birthweight: "" }); // Set default gender to "male"
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
        <div className="breeding-details-container">
            <div className="breeding-details-header">
                <h1>{t("breeding")}</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={formik.handleSubmit} className="breeding-form">
                <div className="form-grid">
                    <div className="form-section">
                        <h2>{t("basic_info")}</h2>
                        <div className="input-group">
                            <label htmlFor="tagId">{t("tag_id")}</label>
                            <input
                                type="text"
                                id="tagId"
                                name="tagId"
                                value={formik.values.tagId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder={t("enter_tag_id")}
                            />
                            {formik.errors.tagId && formik.touched.tagId && (
                                <p className="text-danger">{formik.errors.tagId}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="deliveryState">{t("delivery_state")}</label>
                            <select
                                id="deliveryState"
                                name="deliveryState"
                                value={formik.values.deliveryState}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">{t("select_delivery_state")}</option>
                                <option value="normal">{t("normal")}</option>
                                <option value="difficult">{t("difficult")}</option>
                                <option value="assisted">{t("assisted")}</option>
                                <option value="caesarean">{t("caesarean")}</option>
                            </select>
                            {formik.errors.deliveryState && formik.touched.deliveryState && (
                                <p className="text-danger">{formik.errors.deliveryState}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="deliveryDate">{t("delivery_date")}</label>
                            <input
                                type="date"
                                id="deliveryDate"
                                name="deliveryDate"
                                value={formik.values.deliveryDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.deliveryDate && formik.touched.deliveryDate && (
                                <p className="text-danger">{formik.errors.deliveryDate}</p>
                            )}
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>{t("breeding_details")}</h2>
                        <div className="input-group">
                            <label htmlFor="milking">{t("milking")}</label>
                            <select
                                id="milking"
                                name="milking"
                                value={formik.values.milking}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">{t("select_milking")}</option>
                                <option value="no milk">{t("no_milk")}</option>
                                <option value="one teat">{t("one_teat")}</option>
                                <option value="two teat">{t("two_teat")}</option>
                            </select>
                            {formik.errors.milking && formik.touched.milking && (
                                <p className="text-danger">{formik.errors.milking}</p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="motheringAbility">{t("mothering_ability")}</label>
                            <select
                                id="motheringAbility"
                                name="motheringAbility"
                                value={formik.values.motheringAbility}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="good">{t("good")}</option>
                                <option value="bad">{t("bad")}</option>
                                <option value="medium">{t("medium")}</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label htmlFor="numberOfBirths">{t("number_of_births")}</label>
                            <input
                                type="number"
                                id="numberOfBirths"
                                name="numberOfBirths"
                                value={numberOfBirths}
                                onChange={handleNumberOfBirthsChange}
                                min="1"
                                max="4"
                            />
                            {formik.errors.numberOfBirths && formik.touched.numberOfBirths && (
                                <p className="text-danger">{formik.errors.numberOfBirths}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2>{t("birth_entries")}</h2>
                    {birthEntries.map((entry, index) => (
                        <div key={index} className="birth-entry-card">
                            <h3>{t("calf")} {index + 1}</h3>
                            <div className="input-group">
                                <label htmlFor={`tagId-${index}`}>{t("calf_tag_id")}</label>
                                <input
                                    type="text"
                                    id={`tagId-${index}`}
                                    name="tagId"
                                    value={entry.tagId}
                                    onChange={(e) => handleBirthEntriesChange(e, index)}
                                    placeholder={t("enter_calf_tag_id")}
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor={`gender-${index}`}>{t("gender")}</label>
                                <select
                                    id={`gender-${index}`}
                                    name="gender"
                                    value={entry.gender}
                                    onChange={(e) => handleBirthEntriesChange(e, index)}
                                >
                                    <option value="male">{t("male")}</option>
                                    <option value="female">{t("female")}</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label htmlFor={`birthweight-${index}`}>{t("birth_weight")}</label>
                                <input
                                    type="number"
                                    id={`birthweight-${index}`}
                                    name="birthweight"
                                    value={entry.birthweight}
                                    onChange={(e) => handleBirthEntriesChange(e, index)}
                                    placeholder={t("enter_birth_weight")}
                                />
                            </div>
                        </div>
                    ))}
                </div>
<div className="form-actions">
    <button type="submit" className="save-button" disabled={isLoading}>
        {isLoading ? (
            <span className="loading-spinner"></span>
        ) : (
            <>
                <IoIosSave /> {t("save")}
            </>
        )}
    </button>
{isSubmitted && (
  <button
    type="button"
    className="save-button reset-button"
    onClick={() => {
      formik.resetForm();
      setNumberOfBirths(1);
      setBirthEntries([{ tagId: "", gender: "male", birthweight: "" }]);
      setIsSubmitted(false); // علشان الزر يختفي تاني لو حابة
    }}
  >
    {t("add_new_breeding")}
  </button>
)}

</div>

            </form>
        </div>
    );
}
