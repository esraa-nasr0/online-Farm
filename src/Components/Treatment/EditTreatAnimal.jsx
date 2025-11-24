import axiosInstance from "../../api/axios";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
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

        const { data } = await axiosInstance.get(
          `/treatment/getsingletreatmentforAnimals/${id}`
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
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // Prepare data for API - ensure proper date formatting
        const submitData = {
          tagId: values.tagId,
          locationShed: values.locationShed,
          date: values.date ? new Date(values.date).toISOString() : null,
          eyeCheck: values.eyeCheck,
          rectalCheck: values.rectalCheck,
          respiratoryCheck: values.respiratoryCheck,
          rumenCheck: values.rumenCheck,
          diagnosis: values.diagnosis,
          temperature: values.temperature,
          treatments: values.treatments.map(treatment => ({
            treatmentId: treatment.treatmentId,
            volumePerAnimal: treatment.volumePerAnimal,
            numberOfDoses: treatment.numberOfDoses,
            doses: treatment.doses.map(dose => ({
              date: dose.date ? new Date(dose.date).toISOString() : null,
              taken: dose.taken
            }))
          }))
        };

        console.log("Submitting data:", submitData); // For debugging

        const res = await axiosInstance.patch(
          `/treatment/updatetreatmentforAnimals/${id}`,
          submitData
        );

        if (res.data.status === "SUCCESS") {
          setIsSubmitted(true);
          Swal.fire({
            title: t("success"),
            text: res.data.message || t("animal_update_success"),
            icon: "success",
            confirmButtonText: t("ok"),
          }).then(() => {
            navigate(-1); // Go back to previous page after success
          });
        } else {
          throw new Error(res.data.message);
        }
      } catch (err) {
        console.error("Update error:", err.response?.data || err.message);
        const errorMessage = err.response?.data?.message || err.message || t("error_occurred");
        setError(errorMessage);
        Swal.fire({
          title: t("error"),
          text: errorMessage,
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
      const numDoses = parseInt(value) || 0;
      treatments[index].numberOfDoses = numDoses;
      
      // Preserve existing doses if reducing the number
      const existingDoses = treatments[index].doses || [];
      treatments[index].doses = Array.from({ length: numDoses }, (_, i) => 
        i < existingDoses.length ? existingDoses[i] : { date: "", taken: false }
      );
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
      <div className="treatment-header container">
        <h1>{t("edit_treatment")}</h1>
        
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={formik.handleSubmit} className="treatment-form container">
        <div className="form-grid">
          {/* Animal Details */}
          <div className="form-section">
            <h2>{t("animal_details")}</h2>

            <div className="input-group">
              <label>{t("tag_id")}</label>
              <input 
                type="text" 
                readOnly 
                {...formik.getFieldProps("tagId")} 
                className={formik.touched.tagId && formik.errors.tagId ? "error" : ""}
              />
              {formik.touched.tagId && formik.errors.tagId && (
                <div className="error-text">{formik.errors.tagId}</div>
              )}
            </div>

            <div className="input-group">
              <label>{t("location_shed")}</label>
              <select 
                {...formik.getFieldProps("locationShed")}
                className={formik.touched.locationShed && formik.errors.locationShed ? "error" : ""}
              >
                <option value="">{t("select_location_shed")}</option>
                {locationSheds.map((shed) => (
                  <option key={shed._id} value={shed._id}>
                    {shed.locationShedName}
                  </option>
                ))}
              </select>
              {formik.touched.locationShed && formik.errors.locationShed && (
                <div className="error-text">{formik.errors.locationShed}</div>
              )}
            </div>

            <div className="input-group">
              <label>{t("date")}</label>
              <input 
                type="date" 
                {...formik.getFieldProps("date")} 
                className={formik.touched.date && formik.errors.date ? "error" : ""}
              />
              {formik.touched.date && formik.errors.date && (
                <div className="error-text">{formik.errors.date}</div>
              )}
            </div>
          </div>

          {/* Examinations */}
          <div className="form-section">
            <h2>{t("animal_exminetion_and_diagnosis")}</h2>

            {["eyeCheck", "rectalCheck", "respiratoryCheck", "rumenCheck", "diagnosis"].map((field) => (
              <div className="input-group" key={field}>
                <label>{t(field)}</label>
                <input
                  type="text"
                  name={field}
                  value={formik.values[field]}
                  onChange={formik.handleChange}
                />
              </div>
            ))}
            
            <div className="input-group">
              <label>{t("temperature")}</label>
              <input
                type="number"
                step="0.1"
                name="temperature"
                value={formik.values.temperature}
                onChange={formik.handleChange}
              />
            </div>
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
                  className={formik.touched.treatments && formik.touched.treatments[index]?.treatmentId && formik.errors.treatments && formik.errors.treatments[index]?.treatmentId ? "error" : ""}
                >
                  <option value="">{t("select_treatment")}</option>
                  {treatmentOptions.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
                </select>
                {formik.touched.treatments && formik.touched.treatments[index]?.treatmentId && formik.errors.treatments && formik.errors.treatments[index]?.treatmentId && (
                  <div className="error-text">{formik.errors.treatments[index].treatmentId}</div>
                )}
              </div>

              <div className="input-group">
                <label>{t("volumePerAnimal")}</label>
                <input
                  type="number"
                  step="0.01"
                  name="volumePerAnimal"
                  value={treatment.volumePerAnimal}
                  onChange={(e) => handleTreatmentChange(e, index)}
                  className={formik.touched.treatments && formik.touched.treatments[index]?.volumePerAnimal && formik.errors.treatments && formik.errors.treatments[index]?.volumePerAnimal ? "error" : ""}
                />
                {formik.touched.treatments && formik.touched.treatments[index]?.volumePerAnimal && formik.errors.treatments && formik.errors.treatments[index]?.volumePerAnimal && (
                  <div className="error-text">{formik.errors.treatments[index].volumePerAnimal}</div>
                )}
              </div>

              <div className="input-group">
                <label>{t("number_of_doses")}</label>
                <input
                  type="number"
                  name="numberOfDoses"
                  value={treatment.numberOfDoses}
                  onChange={(e) => handleTreatmentChange(e, index)}
                  className={formik.touched.treatments && formik.touched.treatments[index]?.numberOfDoses && formik.errors.treatments && formik.errors.treatments[index]?.numberOfDoses ? "error" : ""}
                />
                {formik.touched.treatments && formik.touched.treatments[index]?.numberOfDoses && formik.errors.treatments && formik.errors.treatments[index]?.numberOfDoses && (
                  <div className="error-text">{formik.errors.treatments[index].numberOfDoses}</div>
                )}
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