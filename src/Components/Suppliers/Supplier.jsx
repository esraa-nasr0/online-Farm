import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TreatmentContext } from "../../Context/TreatmentContext";
import { Feedcontext } from "../../Context/FeedContext";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { IoIosSave } from "react-icons/io";
import "./Supplier.css";

function Supplier() {
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feeds, setFeeds] = useState([]);
  const [treatmentOptions, setTreatmentOptions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { getTreatmentMenue } = useContext(TreatmentContext);
  const { getFodderMenue } = useContext(Feedcontext);

  // Fetch Feeds
  const fetchFeeds = async () => {
    try {
      const { data } = await getFodderMenue();
      if (data.status === "success") {
        setFeeds(data.data);
      }
    } catch (err) {
      setError(t("fetchFeedError"));
    }
  };

  // Fetch Treatments
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
    fetchFeeds();
    fetchTreatments();
  }, []);

  const getHeaders = () => {
    const Authorization = localStorage.getItem("Authorization");
    const formattedToken = Authorization?.startsWith("Bearer ")
      ? Authorization
      : `Bearer ${Authorization}`;
    return { Authorization: formattedToken };
  };

  async function addSupplier(values) {
    if (isSubmitted) return;
    const headers = getHeaders();
    setIsLoading(true);
    setError(null);
    try {
      console.log("Submitting:", values);
      const { data } = await axios.post(
        `https://farm-project-bbzj.onrender.com/api/supplier/addsupplier`,
        {
          ...values,
          treatmentIds: values.treatmentIds.filter((id) => id !== ""),
          feedIds: values.feedIds.filter((id) => id !== ""),
        },
        { headers }
      );

      if (data.status === "success") {
        setIsLoading(false);
        setIsSubmitted(true);
        formik.resetForm();

        Swal.fire({
          title: t("success"),
          text: t("supplier_added_successfully"),
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

  const validationSchema = Yup.object({
    name: Yup.string()
      .required(t("Name is required"))
      .min(3, t("Name must be at least 3 characters")),
    email: Yup.string()
      .required(t("Email is required"))
      .email(t("Invalid email format")),
    phone: Yup.string()
      .required(t("Phone is required"))
      .matches(/^[0-9]+$/, t("Phone must be digits only")),
    company: Yup.string().required(t("Company is required")),
    notes: Yup.string().max(200, t("Notes must be less than 200 characters")),
    supplyType: Yup.string().required(t("supplyType is required")),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      notes: "",
      treatmentIds: [],
      feedIds: [],
      supplyType:"",
    },
    validationSchema,
    onSubmit: addSupplier,
  });

  // اجعل الـ inputs تظهر أوتوماتيك أول ما الصفحة تفتح
  useEffect(() => {
    if (formik.values.treatmentIds.length === 0) {
      formik.setFieldValue("treatmentIds", [""]);
    }
    if (formik.values.feedIds.length === 0) {
      formik.setFieldValue("feedIds", [""]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add & Remove Treatment
  const addTreat = () => {
    if (!isSubmitted) {
      formik.setFieldValue("treatmentIds", [...formik.values.treatmentIds, ""]);
    }
  };

  const removeTreat = (index) => {
    if (!isSubmitted) {
      const updated = [...formik.values.treatmentIds];
      updated.splice(index, 1);
      formik.setFieldValue("treatmentIds", updated);
    }
  };

  // Add & Remove Feed
  const addFeed = () => {
    if (!isSubmitted) {
      formik.setFieldValue("feedIds", [...formik.values.feedIds, ""]);
    }
  };

  const removeFeed = (index) => {
    if (!isSubmitted) {
      const updated = [...formik.values.feedIds];
      updated.splice(index, 1);
      formik.setFieldValue("feedIds", updated);
    }
  };

  return (
    <div className="treatment-container">
      <div className="treatment-header container">
        <h1>{t("add_supplier")}</h1>
      </div>

      {error && <div className="error-message container">{error}</div>}

      <form onSubmit={formik.handleSubmit} className="treatment-form container">
        <div className="form-grid">
          {/* Supplier Details */}
          <div className="form-section">
            <h2>{t("supplier_details")}</h2>
            <div className="input-group">
              <label>{t("Name")}</label>
              <input
                placeholder={t("placeholder_name")}
                type="text"
                {...formik.getFieldProps("Name")}
                disabled={isSubmitted}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="error-text">{formik.errors.name}</div>
              )}
            </div>
            <div className="input-group">
              <label>{t("email")}</label>
              <input
                placeholder={t("placeholder_email")}
                type="email"
                {...formik.getFieldProps("email")}
                disabled={isSubmitted}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="error-text">{formik.errors.email}</div>
              )}
            </div>
            <div className="input-group">
              <label>{t("phone")}</label>
              <input
                placeholder={t("placeholder_phone")}
                type="text"
                {...formik.getFieldProps("phone")}
                disabled={isSubmitted}
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="error-text">{formik.errors.phone}</div>
              )}
            </div>
            <div className="input-group">
              <label>{t("company")}</label>
              <input
                placeholder={t("placeholder_company")}
                type="text"
                {...formik.getFieldProps("company")}
                disabled={isSubmitted}
              />
              {formik.touched.company && formik.errors.company && (
                <div className="error-text">{formik.errors.company}</div>
              )}
            </div>
            <div className="input-group">
              <label>{t("supplyType")}</label>
              <input
                placeholder={t("supplyType")}
                type="text"
                {...formik.getFieldProps("supplyType")}
                disabled={isSubmitted}
              />
              {formik.touched.supplyType && formik.errors.supplyType && (
                <div className="error-text">{formik.errors.supplyType}</div>
              )}
            </div>
            <div className="input-group">
              <label>{t("notes")}</label>
              <textarea
                placeholder={t("placeholder_notes")}
                {...formik.getFieldProps("notes")}
                disabled={isSubmitted}
              />
              {formik.touched.notes && formik.errors.notes && (
                <div className="error-text">{formik.errors.notes}</div>
              )}
            </div>
          </div>

          {/* Treatments */}
          {/* <div className="form-section">
            <h2>{t("treatments")}</h2>
            {formik.values.treatmentIds.map((value, index) => (
              <div key={index} className="input-group">
                <select
                  value={value}
                  onChange={(e) => {
                    const updated = [...formik.values.treatmentIds];
                    updated[index] = e.target.value;
                    formik.setFieldValue("treatmentIds", updated);
                  }}
                  disabled={isSubmitted}
                >
                  <option value="">{t("select_treatment")}</option>
                  {treatmentOptions.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
                </select>

                {formik.values.treatmentIds.length > 1 && !isSubmitted && (
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
            ))}
            {!isSubmitted && (
              <button
                type="button"
                onClick={addTreat}
                className="add-treatment-button"
              >
                +
              </button>
            )}
          </div> */}

          {/* Feeds */}
          {/* <div className="form-section">
            <h2>{t("feeds")}</h2>
            {formik.values.feedIds.map((value, index) => (
              <div key={index} className="input-group">
                <select
                  value={value}
                  onChange={(e) => {
                    const updated = [...formik.values.feedIds];
                    updated[index] = e.target.value;
                    formik.setFieldValue("feedIds", updated);
                  }}
                  disabled={isSubmitted}
                >
                  <option value="">{t("select_feed")}</option>
                  {feeds.map((feed) => (
                    <option key={feed._id} value={feed._id}>
                      {feed.name}
                    </option>
                  ))}
                </select>

                {formik.values.feedIds.length > 1 && !isSubmitted && (
                  <div className="remove-treatment-wrapper">
                    <button
                      type="button"
                      className="remove-treatment-button mt-2"
                      onClick={() => removeFeed(index)}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            ))}
            {!isSubmitted && (
              <button
                type="button"
                onClick={addFeed}
                className="add-treatment-button"
              >
                +
              </button>
            )}
          </div> */}

        </div>

        {/* Save Button */}
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
            <button
              type="button"
              className="save-button"
              onClick={() => setIsSubmitted(false)}
            >
              {t("add_new_supplier")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default Supplier;
