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
    const formattedToken = Authorization?.startsWith("Bearer ")
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
      date: "",
      eyeCheck: "",
      rectalCheck: "",
      respiratoryCheck: "",
      rumenCheck: "",
      diagnosis: "",
      temperature: "",
      date: "",
      treatments: [
        {
          treatmentId: "",
          volumePerAnimal: "",
          numberOfDoses: "",
          doses: [],
        },
      ],
    },
    onSubmit: submitTreatment,
  });

  const addTreat = () => {
    if (!isSubmitted) {
      formik.setFieldValue("treatments", [
        ...formik.values.treatments,
        {
          treatmentId: "",
          volumePerAnimal: "",
          numberOfDoses: "",
          doses: [],
        },
      ]);
    }
  };

  const handleTreatmentChange = (e, index) => {
    if (!isSubmitted) {
      const { name, value } = e.target;
      const updatedTreatments = [...formik.values.treatments];

      if (name === "numberOfDoses") {
        const doseCount = Number(value);
        updatedTreatments[index][name] = doseCount;
        updatedTreatments[index].doses = Array.from({ length: doseCount }, () => ({
          date: "",
          taken: false,
        }));
      } else {
        updatedTreatments[index][name] =
          name === "volumePerAnimal" ? Number(value) : value;
      }

      formik.setFieldValue("treatments", updatedTreatments);
    }
  };

  const resetForm = () => {
    formik.resetForm({
      values: {
        tagId: "",
        date: "",
        eyeCheck: "",
        rectalCheck: "",
        respiratoryCheck: "",
        rumenCheck: "",
        diagnosis: "",
        temperature: "",
        date: "",
        treatments: [
          {
            treatmentId: "",
            volumePerAnimal: "",
            numberOfDoses: "",
            doses: [],
          },
        ],
      },
    });
    setIsSubmitted(false);
  };

  const removeTreat = (index) => {
    if (!isSubmitted) {
      const updatedTreatments = [...formik.values.treatments];
      updatedTreatments.splice(index, 1);
      formik.setFieldValue("treatments", updatedTreatments);
    }
  };

  return (
    <div className="treatment-container">
      <div className="treatment-header">
        <h1>{t("treatment_by_animal")}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}


      <form onSubmit={formik.handleSubmit} className="treatment-form">
        <div className="form-grid">
          {/* Animal Details */}
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

          {/* Examination */}
          <div className="form-section">
            <h2>{t("animal_exminetion_and_diagnosis")}</h2>
            <div className="input-group">
              <label htmlFor="eyeCheck">{t("eye_check")}</label>
              <input
                type="text"
                id="eyeCheck"
                name="eyeCheck"
                value={formik.values.eyeCheck}
                onChange={formik.handleChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="rectalCheck">{t("rectal_check")}</label>
              <input
                type="text"
                id="rectalCheck"
                name="rectalCheck"
                value={formik.values.rectalCheck}
                onChange={formik.handleChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="respiratoryCheck">{t("respiratory_check")}</label>
              <input
                type="text"
                id="respiratoryCheck"
                name="respiratoryCheck"
                value={formik.values.respiratoryCheck}
                onChange={formik.handleChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="rumenCheck">{t("rumen_check")}</label>
              <input
                type="text"
                id="rumenCheck"
                name="rumenCheck"
                value={formik.values.rumenCheck}
                onChange={formik.handleChange}
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="temperature">{t("temperature")}</label>
              <input
                type="number"
                id="temperature"
                name="temperature"
                value={formik.values.temperature}
                onChange={formik.handleChange}
                disabled={isSubmitted}
                placeholder={t("enter_temperature")}
              />
            </div>
            <div className="input-group">
              <label htmlFor="diagnosis">{t("diagnosis")}</label>
              <input
                type="text"
                id="diagnosis"
                name="diagnosis"
                value={formik.values.diagnosis}
                onChange={formik.handleChange}
                disabled={isSubmitted}
                placeholder={t("enter_diagnosis")}
              />
            </div>
          </div>

          {/* Treatments */}
          {formik.values.treatments.map((treatment, index) => {
            return (
              <div key={index} className="form-section">
                <h2>{t("treatments")}</h2>
                <div className="input-group">
                  <label>{t("treatment_name")}</label>
                  <select
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

                  <label>{t("volumePerAnimal")}</label>
                  <input
                    type="number"
                    name="volumePerAnimal"
                    value={treatment.volumePerAnimal}
                    onChange={(e) => handleTreatmentChange(e, index)}
                    disabled={isSubmitted}
                    placeholder={t("enter_volumePerAnimal")}
                  />

                  <label>{t("number_of_doses")}</label>
                  <input
                    type="number"
                    name="numberOfDoses"
                    value={treatment.numberOfDoses}
                    onChange={(e) => handleTreatmentChange(e, index)}
                    disabled={isSubmitted}
                    placeholder={t("enter_number_of_doses")}
                  />

                  {treatment.doses.map((dose, doseIndex) => (
                    <div key={doseIndex} className="dose-row">
                      <div className="input-group">
                        <label>{t("dose_date")} ({doseIndex + 1})</label>
                        <input
                          type="date"
                          value={dose.date}
                          onChange={(e) => {
                            const updatedTreatments = [...formik.values.treatments];
                            updatedTreatments[index].doses[doseIndex].date = e.target.value;
                            formik.setFieldValue("treatments", updatedTreatments);
                          }}
                          disabled={isSubmitted}
                        />
                      </div>
                      <div className="input-group checkbox-group">
                        <label>{t("taken")}</label>
                        <input
                          type="checkbox"
                          checked={dose.taken}
                          onChange={(e) => {
                            const updatedTreatments = [...formik.values.treatments];
                            updatedTreatments[index].doses[doseIndex].taken = e.target.checked;
                            formik.setFieldValue("treatments", updatedTreatments);
                          }}
                          disabled={isSubmitted}
                        />
                      </div>
                    </div>
                  ))}

                  {formik.values.treatments.length > 1 && !isSubmitted && (
                    <div className="remove-treatment-wrapper">
                      <button
                        type="button"
                        className="remove-treatment-button mt-2"
                        onClick={() => removeTreat(index)}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
