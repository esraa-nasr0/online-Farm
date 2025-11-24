import axiosInstance from "../../api/axios";
import { useFormik } from "formik";
import React, { useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { IoIosSave } from "react-icons/io";
import * as Yup from "yup";
import { TreatmentContext } from "../../Context/TreatmentContext";
import { LocationContext } from "../../Context/LocationContext";
import { useTranslation } from "react-i18next";
import "./Treatment.css";
import { useNavigate } from "react-router-dom";

function TreatmentLocation() {
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locationSheds, setLocationSheds] = useState([]);
  const [treatmentOptions, setTreatmentOptions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { getTreatmentMenue } = useContext(TreatmentContext);
  const { LocationMenue } = useContext(LocationContext);
  const navigate = useNavigate();

  const fetchLocation = async () => {
    try {
      const { data } = await LocationMenue();
      if (data?.status === "success") {
        setLocationSheds(data.data.locationSheds || []);
      } else {
        setLocationSheds([]);
      }
    } catch (err) {
      setError(t("failed_to_load_location_sheds"));
      setLocationSheds([]);
    }
  };

  const fetchTreatments = async () => {
    try {
      const { data } = await getTreatmentMenue();
      if (data?.status === "success") {
        setTreatmentOptions(data.data || []);
      } else {
        setTreatmentOptions([]);
      }
    } catch (err) {
      setError(t("failed_to_load_treatment_data"));
      setTreatmentOptions([]);
    }
  };

  useEffect(() => {
    fetchLocation();
    fetchTreatments();
  }, []);

  async function submitTreatment(values) {
    if (isSubmitted) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.post(
        `/treatment/addtreatmentbylocationshed`,
        values
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
      locationShed: "",
      diagnosis: "",
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
        locationShed: "",
        diagnosis: "",
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
      <div className="treatment-header container">
        <h1>{t("treatment_by_location")}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isSubmitted && (
        <div className="success-message">
          <h3>{t("treatment_saved_successfully")}</h3>
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="treatment-form container">
        <div className="form-grid">
          {/* General Information */}
          <div className="form-section">
            <h2>{t("general_info")}</h2>

            <div className="input-group">
              <label>{t("location_shed")}</label>
              <select 
                {...formik.getFieldProps("locationShed")}
                disabled={isSubmitted}
              >
                <option value="">{t("select_location_shed")}</option>
                {locationSheds.map((shed) => (
                  <option key={shed._id} value={shed._id}>
                    {shed.locationShedName}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>{t("date")}</label>
              <input 
                type="date" 
                {...formik.getFieldProps("date")} 
                disabled={isSubmitted}
              />
            </div>

            <div className="input-group">
              <label>{t("diagnosis")}</label>
              <input
                type="text"
                {...formik.getFieldProps("diagnosis")}
                disabled={isSubmitted}
                placeholder={t("enter_diagnosis")}
              />
            </div>
          </div>

          {/* Treatments */}
          {formik.values.treatments.map((treatment, index) => (
            <div key={`treat-${index}`} className="form-section">
              <h2>{t("treatments")}</h2>
              <div className="treatment-item">
                <div className="input-group">
                  <label>{t("treatment_name")}</label>
                  <select
                    name="treatmentId"
                    value={treatment.treatmentId}
                    onChange={(e) => handleTreatmentChange(e, index)}
                    disabled={isSubmitted}
                  >
                    <option value="">{t("select_treatment")}</option>
                    {treatmentOptions.map((opt) => (
                      <option key={opt._id} value={opt._id}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label>{t("volumePerAnimal")}</label>
                  <input
                    type="number"
                    name="volumePerAnimal"
                    value={treatment.volumePerAnimal}
                    onChange={(e) => handleTreatmentChange(e, index)}
                    disabled={isSubmitted}
                    placeholder={t("enter_volumePerAnimal")}
                  />
                </div>

                <div className="input-group">
                  <label>{t("number_of_doses")}</label>
                  <input
                    type="number"
                    name="numberOfDoses"
                    value={treatment.numberOfDoses}
                    onChange={(e) => handleTreatmentChange(e, index)}
                    disabled={isSubmitted}
                    placeholder={t("enter_number_of_doses")}
                    min={1}
                  />
                </div>

                {treatment.doses.map((dose, doseIndex) => (
                  <div key={`dose-${doseIndex}`} className="dose-row">
                    <div className="input-group">
                      <label>
                        {t("dose_date")} ({doseIndex + 1})
                      </label>
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
                  <button
                    type="button"
                    className="remove-treatment-button"
                    onClick={() => removeTreat(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}

          {!isSubmitted && (
            <button
              type="button"
              onClick={addTreat}
              className="add-treatment-button mt-2"
            >
              +
            </button>
          )}
        </div>

        <div className="form-actions">
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

export default TreatmentLocation;