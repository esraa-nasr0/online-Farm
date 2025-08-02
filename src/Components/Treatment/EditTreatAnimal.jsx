import axios from "axios";
import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { IoIosSave } from "react-icons/io";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { TreatmentContext } from "../../Context/TreatmentContext";
import { LocationContext } from "../../Context/LocationContext";
import { useTranslation } from "react-i18next";
import "./Treatment.css";

function EditTreatAnimal() {
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locationSheds, setLocationSheds] = useState([]);
  const [treatmentOptions, setTreatmentOptions] = useState([]);
  const { getTreatmentMenue } = useContext(TreatmentContext);
  const { LocationMenue } = useContext(LocationContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem("Authorization");
    if (!token) return {};
    return {
      Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const formatDate = (isoString) => (isoString ? isoString.split("T")[0] : "");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const locationResponse = await LocationMenue();
        if (locationResponse?.data?.status === "success") {
          setLocationSheds(locationResponse.data.data.locationSheds || []);
        }

        const treatmentResponse = await getTreatmentMenue();
        if (treatmentResponse?.data?.status === "success") {
          setTreatmentOptions(treatmentResponse.data.data || []);
        }

        const { data } = await axios.get(
          `https://farm-project-bbzj.onrender.com/api/treatment/getsingletreatmentforAnimals/${id}`,
          { headers: getHeaders() }
        );

        const treatment = data?.data?.treatments?.[0];
        if (treatment) {
          formik.setValues({
            tagId: treatment.tagId || "",
            locationShed: treatment.locationShed || "",
            date: formatDate(treatment.date) || "",
            eyeCheck: treatment.eyeCheck || "",
            rectalCheck: treatment.rectalCheck || "",
            respiratoryCheck: treatment.respiratoryCheck || "",
            rumenCheck: treatment.rumenCheck || "",
            diagnosis: treatment.diagnosis || "",
            temperature: treatment.temperature || "",
            treatments: treatment.treatments?.map((comp) => ({
              treatmentId: comp.treatmentId || "",
              volumePerAnimal: comp.volumePerAnimal || "",
              numberOfDoses: comp.numberOfDoses || "",
              doses: comp.doses?.map((dose) => ({
                date: formatDate(dose.date),
                taken: dose.taken,
              })) || [],
            })) || [],
          });
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError(t("failed_to_load_data"));
        Swal.fire({ title: t("error"), text: t("failed_to_load_data"), icon: "error" });
      }
    };

    fetchInitialData();
  }, [id]);

  const validationSchema = Yup.object({
    tagId: Yup.string().required(t("tagId_required")),
    locationShed: Yup.string().required(t("location_shed_required")),
    date: Yup.date().required(t("date_required")),
    treatments: Yup.array()
      .of(
        Yup.object({
          treatmentId: Yup.string().required(t("treatment_id_required")),
          volumePerAnimal: Yup.number()
            .required(t("volume_required"))
            .positive(t("volume_positive"))
            .typeError(t("volume_valid_number")),
          numberOfDoses: Yup.number()
            .required(t("doses_required"))
            .positive(t("doses_positive"))
            .integer(t("doses_integer"))
            .typeError(t("doses_number")),
        })
      )
      .min(1, t("at_least_one_treatment")),
  });

  const formik = useFormik({
    initialValues: {
      tagId: "",
      locationShed: "",
      date: "",
      eyeCheck: "",
      rectalCheck: "",
      respiratoryCheck: "",
      rumenCheck: "",
      diagnosis: "",
      temperature: "",
      treatments: [{
        treatmentId: "",
        volumePerAnimal: "",
        numberOfDoses: "",
        doses: [],
      }],
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const res = await axios.patch(
          `https://farm-project-bbzj.onrender.com/api/treatment/updatetreatmentforAnimals/${id}`,
          values,
          { headers: getHeaders() }
        );

        if (res.data.status === "SUCCESS") {
          setIsSubmitted(true);
          Swal.fire({
            title: t("success"),
            text: res.data.message || t("animal_update_success"),
            icon: "success",
            confirmButtonText: t("ok"),
          });
        } else {
          throw new Error(res.data.message);
        }
      } catch (err) {
        setError(err.message || t("error_occurred"));
        Swal.fire({
          title: t("error"),
          text: err.message || t("error_occurred"),
          icon: "error",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleTreatmentChange = (e, index) => {
    const { name, value } = e.target;
    const treatments = [...formik.values.treatments];

    if (name === "numberOfDoses") {
      treatments[index].numberOfDoses = value;
      treatments[index].doses = Array.from({ length: Number(value) || 0 }, () => ({
        date: "",
        taken: false,
      }));
    } else {
      treatments[index][name] = value;
    }

    formik.setFieldValue("treatments", treatments);
  };

  const addTreat = () => {
    formik.setFieldValue("treatments", [
      ...formik.values.treatments,
      {
        treatmentId: "",
        volumePerAnimal: "",
        numberOfDoses: "",
        doses: [],
      },
    ]);
  };

  const removeTreat = (indexToRemove) => {
    const updated = [...formik.values.treatments];
    updated.splice(indexToRemove, 1);
    formik.setFieldValue("treatments", updated);
  };

  return (
    <div className="treatment-container">
      <div className="treatment-header">
        <h1>{t("edit_treatment")}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={formik.handleSubmit} className="treatment-form">
        <div className="form-grid">
          {/* Animal Details */}
          <div className="form-section">
            <h2>{t("animal_details")}</h2>

            <div className="input-group">
              <label>{t("tag_id")}</label>
              <input type="text" readOnly {...formik.getFieldProps("tagId")} />
            </div>

            <div className="input-group">
              <label>{t("location_shed")}</label>
              <select {...formik.getFieldProps("locationShed")}>
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
              <input type="date" {...formik.getFieldProps("date")} />
            </div>
          </div>

          {/* Examinations */}
          <div className="form-section">
            <h2>{t("animal_exminetion_and_diagnosis")}</h2>

            {["eyeCheck", "rectalCheck", "respiratoryCheck", "rumenCheck", "diagnosis", "temperature"].map((field) => (
              <div className="input-group" key={field}>
                <label>{t(field)}</label>
                <input
                  type={field === "temperature" ? "number" : "text"}
                  name={field}
                  value={formik.values[field]}
                  onChange={formik.handleChange}
                />
              </div>
            ))}
          </div>

          {/* Treatments */}
          {formik.values.treatments.map((treatment, index) => (
            <div key={index} className="form-section">
              <h2>{t("treatments")} #{index + 1}</h2>

              <div className="input-group">
                <label>{t("treatment_name")}</label>
                <select
                  name="treatmentId"
                  value={treatment.treatmentId}
                  onChange={(e) => handleTreatmentChange(e, index)}
                >
                  <option value="">{t("select_treatment")}</option>
                  {treatmentOptions.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
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
                />
              </div>

              <div className="input-group">
                <label>{t("number_of_doses")}</label>
                <input
                  type="number"
                  name="numberOfDoses"
                  value={treatment.numberOfDoses}
                  onChange={(e) => handleTreatmentChange(e, index)}
                />
              </div>

              {/* Dose Inputs */}
              {treatment.doses?.map((dose, doseIndex) => (
                <div key={doseIndex} className="dose-row">
                  <div className="input-group">
                    <label>{t("dose_date")} {doseIndex + 1}</label>
                    <input
                      type="date"
                      value={dose.date}
                      onChange={(e) => {
                        const updated = [...formik.values.treatments];
                        updated[index].doses[doseIndex].date = e.target.value;
                        formik.setFieldValue("treatments", updated);
                      }}
                    />
                  </div>

                  <div className="input-group checkbox-group">
                    <label>{t("taken")}</label>
                    <input
                      type="checkbox"
                      checked={dose.taken}
                      onChange={(e) => {
                        const updated = [...formik.values.treatments];
                        updated[index].doses[doseIndex].taken = e.target.checked;
                        formik.setFieldValue("treatments", updated);
                      }}
                    />
                  </div>
                </div>
              ))}

              {/* Remove Button */}
              {formik.values.treatments.length > 1 && (
                <button
                  type="button"
                  className="remove-treatment-button"
                  onClick={() => removeTreat(index)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="button" onClick={addTreat} className="add-treatment-button">
            +
          </button>

          <button type="submit" className="save-button" disabled={isLoading}>
            {isLoading ? <span className="loading-spinner"></span> : <><IoIosSave /> {t("save")}</>}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditTreatAnimal;
