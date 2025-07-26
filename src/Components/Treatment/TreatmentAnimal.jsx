import axios from "axios";
import { useFormik } from "formik";
import React, { useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { IoIosSave } from "react-icons/io";
import * as Yup from "yup";
import { TreatmentContext } from "../../Context/TreatmentContext";
import { useTranslation } from "react-i18next";
import "./Treatment.css";
import { useNavigate } from "react-router-dom";

function TreatmentAnimal() {
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [treatmentOptions, setTreatmentOptions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { getTreatmentMenue } = useContext(TreatmentContext);
  const navigate = useNavigate();

  const getHeaders = () => {
    const Authorization = localStorage.getItem("Authorization");
    const formattedToken = Authorization.startsWith("Bearer ")
      ? Authorization
      : `Bearer ${Authorization}`;
    return { Authorization: formattedToken };
  };

  const fetchTreatments = async () => {
    try {
      const { data } = await getTreatmentMenue();
      if (data.status === "success" && Array.isArray(data.data)) {
        setTreatmentOptions(data.data);
      } else {
        setTreatmentOptions([]);
      }
    } catch (err) {
      setError(t("failed_to_load_treatment_data"));
      setTreatmentOptions([]);
    }
  };

  useEffect(() => {
    fetchTreatments();
  }, [getTreatmentMenue]);

  async function submitTreatment(values) {
    if (isSubmitted) return;

    const headers = getHeaders();
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(
        `https://farm-project-bbzj.onrender.com/api/treatment/addtreatmentbyanimal`,
        values,
        { headers }
      );

      if (data.status === "SUCCESS") {
        setIsLoading(false);
        setIsSubmitted(true);
        formik.resetForm();

        Swal.fire({
          title: t("success"),
          text: t("treatment_added_successfully"),
          icon: "success",
          confirmButtonText: t("ok"),
        });
        navigate("/treatAnimalTable");
      }
    } catch (error) {
      setIsLoading(false);
      Swal.fire(
        t("error"),
        error.response?.data?.message || t("error_message"),
        "error"
      );
    }
  }

  const formik = useFormik({
    initialValues: {
      tagId: "",
      eyeCheck: false,
      rectalCheck: false,
      respiratoryCheck: false,
      rumenCheck: false,
      treatments: [{ treatmentId: "", doses: "" }],
      date: "",
    },
    onSubmit: submitTreatment,
  });

  const addTreat = () => {
    if (!isSubmitted) {
      formik.setFieldValue("treatments", [
        ...formik.values.treatments,
        { treatmentId: "", doses: "" },
      ]);
    }
  };

  const handleTreatmentChange = (e, index) => {
    if (!isSubmitted) {
      const { name, value } = e.target;
      const updatedTreatments = [...formik.values.treatments];
      updatedTreatments[index][name] = name === "doses" ? Number(value) : value;
      formik.setFieldValue("treatments", updatedTreatments);
    }
  };

  const resetForm = () => {
    formik.resetForm({
      values: {
        tagId: "",
        eyeCheck: false,
        rectalCheck: false,
        respiratoryCheck: false,
        rumenCheck: false,
        treatments: [{ treatmentId: "", doses: "" }],
        date: "",
      },
    });
    setIsSubmitted(false);
  };

  return (
    <div className="treatment-container">
      <div className="treatment-header">
        <h1>{t("treatment_by_animal")}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isSubmitted && (
        <div className="success-message">
          <h3>{t("treatment_saved_successfully")}</h3>
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="treatment-form">
        <div className="form-grid">
          <div className="form-section">
            <h2>{t("animal_exminetion")}</h2>

            <div className="input-group checkbox-group">
              <input
                type="checkbox"
                id="eyeCheck"
                name="eyeCheck"
                checked={formik.values.eyeCheck}
                onChange={formik.handleChange}
              />
              <label htmlFor="eyeCheck">{t("eye_check")}</label>
            </div>

            <div className="input-group checkbox-group">
              <input
                type="checkbox"
                id="rectalCheck"
                name="rectalCheck"
                checked={formik.values.rectalCheck}
                onChange={formik.handleChange}
              />
              <label htmlFor="rectalCheck">{t("rectal_check")}</label>
            </div>

            <div className="input-group checkbox-group">
              <input
                type="checkbox"
                id="respiratoryCheck"
                name="respiratoryCheck"
                checked={formik.values.respiratoryCheck}
                onChange={formik.handleChange}
              />
              <label htmlFor="respiratoryCheck">{t("respiratory_check")}</label>
            </div>

            <div className="input-group checkbox-group">
              <input
                type="checkbox"
                id="rumenCheck"
                name="rumenCheck"
                checked={formik.values.rumenCheck}
                onChange={formik.handleChange}
              />
              <label htmlFor="rumenCheck">{t("rumen_check")}</label>
            </div>
          </div>

          <div className="form-section">
            <h2>{t("animal_details")}</h2>

            <div className="input-group">
              <label htmlFor="tagId">{t("tag_id")}</label>
              <input
                id="tagId"
                type="text"
                {...formik.getFieldProps("tagId")}
                disabled={isSubmitted}
                placeholder={t("enter_tag_id")}
              />
            </div>

            <div className="input-group">
              <label htmlFor="date">{t("date")}</label>
              <input
                id="date"
                type="date"
                {...formik.getFieldProps("date")}
                disabled={isSubmitted}
              />
            </div>
          </div>

          <div className="form-section">
            <h2>{t("treatments")}</h2>
            {formik.values.treatments.map((treatment, index) => (
              <div key={index} className="input-group">
                <label htmlFor={`treatment-${index}`}>
                  {t("treatment_name")}
                </label>
                <select
                  id={`treatment-${index}`}
                  name="treatmentId"
                  value={treatment.treatmentId}
                  onChange={(e) => handleTreatmentChange(e, index)}
                  disabled={isSubmitted}
                >
                  <option value="">{t("select_treatment")}</option>
                  {treatmentOptions.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
                </select>

                <label htmlFor={`doses-${index}`}>{t("doses")}</label>
                <input
                  type="number"
                  id={`doses-${index}`}
                  name="doses"
                  value={treatment.doses}
                  onChange={(e) => handleTreatmentChange(e, index)}
                  disabled={isSubmitted}
                  placeholder={t("enter_doses")}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          {!isSubmitted && (
            <button
              type="button"
              onClick={addTreat}
              className="add-treatment-button"
            >
              +
            </button>
          )}

          {isLoading ? (
            <button type="submit" className="save-button" disabled>
              <span className="loading-spinner"></span>
            </button>
          ) : (
            <button
              type="submit"
              className="save-button"
              disabled={isLoading || isSubmitted}
            >
              <IoIosSave /> {t("save")}
            </button>
          )}

          {isSubmitted && (
            <button type="button" className="save-button" onClick={resetForm}>
              {t("add_new_treatment")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TreatmentAnimal;
