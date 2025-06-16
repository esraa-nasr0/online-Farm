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
import './Treatment.css';


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

  const getHeaders = () => {
    const Authorization = localStorage.getItem("Authorization");
    if (!Authorization) return {};
    return {
      Authorization: Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`,
    };
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { data } = await LocationMenue();
        setLocationSheds(data?.status === "success" ? data.data.locationSheds || [] : []);
      } catch (err) {
        console.error("Error loading location sheds:", err);
        setError("Failed to load location sheds");
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const { data } = await getTreatmentMenue();
        setTreatmentOptions(data?.status === "success" ? data.data || [] : []);
      } catch (err) {
        console.error("Error loading treatment data:", err);
        setError("Failed to load treatment data");
      }
    };

    fetchTreatments();
  }, []);

  const formatDate = (isoString) => (isoString ? isoString.split("T")[0] : "");

  const validationSchema = Yup.object({
    tagId: Yup.string().required(t("tagId_required")),
    locationShed: Yup.string().required(t("location_shed_required")),
    date: Yup.date().required(t("date_required")),
    treatments: Yup.array()
      .of(
        Yup.object({
          treatmentId: Yup.string().required(t("treatment_id_required")),
          volume: Yup.number()
            .required(t("volume_required"))
            .positive(t("volume_positive"))
            .typeError(t("volume_valid_number")),
        })
      )
      .min(1, t("at_least_one_treatment")),
  });

  const formik = useFormik({
    initialValues: {
      tagId: "",
      locationShed: "",
      date: "",
      treatments: [{ treatmentId: "", volume: "" }],
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await axios.patch(
          `https://farm-project-bbzj.onrender.com/api/treatment/updatetreatmentforAnimals/${id}`,
          values,
          { headers: getHeaders() }
        );

        if (data.status === "success") {
          Swal.fire({
            title: t("success_title"),
            text: t("success_text"),
            icon: "success",
            confirmButtonText: t("ok"),
          });
          navigate("/treatAnimalTable");
        }
      } catch (err) {
        console.error("Error updating treatment:", err);
        setError(err.response?.data?.message || t("error_occurred"));
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchTreatment = async () => {
      setError(null);
      try {
        const { data } = await axios.get(
          `https://farm-project-bbzj.onrender.com/api/treatment/getsingletreatmentforAnimals/${id}`,
          { headers: getHeaders() }
        );

        if (data?.data?.treatmentShed) {
          const treatment = data.data.treatmentShed;
          formik.setValues({
            tagId: treatment.tagId || "",
            locationShed: treatment.locationShed?._id || "",
            date: formatDate(treatment.date) || "",
            treatments:
              treatment.treatments?.map((comp) => ({
                treatmentId: comp.treatmentId || "",
                volume: comp.volume || "",
              })) || [{ treatmentId: "", volume: "" }],
          });
        } else {
          throw new Error("Unexpected API response structure");
        }
      } catch (error) {
        console.error("Failed to fetch treatment data:", error);
        setError(t("failed_to_fetch_treatment_details"));
      }
    };

    fetchTreatment();
  }, [id]);

  const addTreat = () => {
    formik.setFieldValue("treatments", [
      ...formik.values.treatments,
      { treatmentId: "", volume: "" },
    ]);
  };

  const handleTreatmentChange = (e, index) => {
    const { name, value } = e.target;
    const treatments = [...formik.values.treatments];
    treatments[index][name] = value;
    formik.setFieldValue("treatments", treatments);
  };

  return (
    <div className="treatment-container">
      <div className="treatment-header">
        <h1>{t("edit_treatment")}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={formik.handleSubmit} className="treatment-form">
        <div className="form-grid">
          <div className="form-section">
            <h2>{t("animal_details")}</h2>
            <div className="input-group">
              <label htmlFor="tagId">{t("tag_id")}</label>
              <input
                id="tagId"
                type="text"
                {...formik.getFieldProps("tagId")}
                placeholder={t("enter_tag_id")}
              />
              {formik.errors.tagId && formik.touched.tagId && (
                <p className="error-message">{formik.errors.tagId}</p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="locationShed">{t("location_shed")}</label>
              <select
                id="locationShed"
                {...formik.getFieldProps("locationShed")}
                className="input-group"
              >
                <option value="">{t("select_location_shed")}</option>
                {locationSheds?.map((shed) => (
                  <option key={shed._id} value={shed._id}>
                    {shed.locationShedName}
                  </option>
                ))}
              </select>
              {formik.errors.locationShed && formik.touched.locationShed && (
                <p className="error-message">{formik.errors.locationShed}</p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="date">{t("date")}</label>
              <input
                id="date"
                type="date"
                {...formik.getFieldProps("date")}
              />
              {formik.errors.date && formik.touched.date && (
                <p className="error-message">{formik.errors.date}</p>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2>{t("treatments")}</h2>
            {formik.values.treatments.map((treatment, index) => (
              <div key={index} className="input-group">
                <label htmlFor={`treatment-${index}`}>{t("treatment_name")}</label>
                <select
                  id={`treatment-${index}`}
                  name="treatmentId"
                  value={treatment.treatmentId}
                  onChange={(e) => handleTreatmentChange(e, index)}
                  className="input-group"
                >
                  <option value="">{t("select_treatment")}</option>
                  {treatmentOptions.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
                </select>

                <label htmlFor={`volume-${index}`}>{t("volume")}</label>
                <input
                  type="number"
                  id={`volume-${index}`}
                  name="volume"
                  value={treatment.volume}
                  onChange={(e) => handleTreatmentChange(e, index)}
                  placeholder={t("enter_volume")}
                />
                {formik.errors.treatments?.[index]?.treatmentId && (
                  <p className="error-message">{formik.errors.treatments[index].treatmentId}</p>
                )}
                {formik.errors.treatments?.[index]?.volume && (
                  <p className="error-message">{formik.errors.treatments[index].volume}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={addTreat} className="add-treatment-button">
            +
          </button>
          {isLoading ? (
            <button type="submit" className="save-button" disabled>
              <span className="loading-spinner"></span>
            </button>
          ) : (
            <button type="submit" className="save-button">
              <IoIosSave /> {t("save")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default EditTreatAnimal;
