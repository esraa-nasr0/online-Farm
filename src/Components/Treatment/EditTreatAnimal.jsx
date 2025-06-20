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

  const getHeaders = () => {
    const token = localStorage.getItem("Authorization");
    if (!token) return {};
    return {
      Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch location sheds
        const locationResponse = await LocationMenue();
        if (locationResponse?.data?.status === "success") {
          setLocationSheds(locationResponse.data.data.locationSheds || []);
        }

        // Fetch treatment options
        const treatmentResponse = await getTreatmentMenue();
        if (treatmentResponse?.data?.status === "success") {
          setTreatmentOptions(treatmentResponse.data.data || []);
        }

        // Fetch existing treatment data
        const treatmentData = await axios.get(
          `https://farm-project-bbzj.onrender.com/api/treatment/getsingletreatmentforAnimals/${id}`,
          { headers: getHeaders() }
        );

        if (treatmentData?.data?.data?.treatmentShed) {
          const treatment = treatmentData.data.data.treatmentShed;
          formik.setValues({
            tagId: treatment.tagId || "",
            locationShed: treatment.locationShed?._id || "",
            date: formatDate(treatment.date) || "",
            treatments: treatment.treatments?.map((comp) => ({
              treatmentId: comp.treatmentId || "",
              volume: comp.volume || "",
            })) || [{ treatmentId: "", volume: "" }],
          });
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        setError(t("failed_to_load_data"));
        Swal.fire({
          title: t("error_title"),
          text: t("failed_to_load_data"),
          icon: "error",
        });
      }
    };

    fetchInitialData();
  }, [id]);

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
    const response = await axios.patch(
      `https://farm-project-bbzj.onrender.com/api/treatment/updatetreatmentforAnimals/${id}`,
      values,
      { headers: getHeaders() }
    );

    console.log("response:", response.data); // شوفي شكل الداتا الراجعة

    if (response.data.status === "SUCCESS") {
      await Swal.fire({
        title: t("success_title"),
        text: response.data.message || t("animal_update_success"),
        icon: "success",
        confirmButtonText: t("ok"),
      });
      navigate("/treatAnimalTable");
      return; // ده مهم عشان يمنع تكملة الكود
    }

    // لو مش success، اعملي throw
    throw new Error(response.data.message || "Update failed");

  } catch (err) {
    console.error("Error updating treatment:", err);
    setError(err.response?.data?.message || err.message || t("error_occurred"));
    Swal.fire({
      title: t("error_title"),
      text: err.response?.data?.message || err.message || t("error_occurred"),
      icon: "error",
      confirmButtonText: t("ok"),
    });
  } finally {
    setIsLoading(false);
  }
}
  });

  const addTreat = () => {
    formik.setFieldValue("treatments", [
      ...formik.values.treatments,
      { treatmentId: "", volume: "" },
    ]);
  };

  const handleTreatmentChange = (e, index) => {
    const { name, value } = e.target;
    formik.setFieldValue(`treatments[${index}].${name}`, value);
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
                readOnly
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
                disabled={isLoading}
              >
                <option value="">{t("select_location_shed")}</option>
                {locationSheds.map((shed) => (
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
                disabled={isLoading}
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
                <label htmlFor={`treatment-${index}`}>
                  {t("treatment_name")}
                </label>
                <select
                  id={`treatment-${index}`}
                  name="treatmentId"
                  value={treatment.treatmentId}
                  onChange={(e) => handleTreatmentChange(e, index)}
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
                {formik.errors.treatments?.[index]?.treatmentId && (
                  <p className="error-message">
                    {formik.errors.treatments[index].treatmentId}
                  </p>
                )}
                {formik.errors.treatments?.[index]?.volume && (
                  <p className="error-message">
                    {formik.errors.treatments[index].volume}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={addTreat}
            className="add-treatment-button"
            disabled={isLoading}
          >
            +
          </button>
          <button type="submit" className="save-button" disabled={isLoading}>
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <IoIosSave /> {t("save")}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditTreatAnimal;
