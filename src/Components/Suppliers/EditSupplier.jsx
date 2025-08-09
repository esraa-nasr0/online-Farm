import React, { useEffect, useState, useContext } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { IoIosSave } from "react-icons/io";
import {  useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { TreatmentContext } from "../../Context/TreatmentContext";
import { Feedcontext } from "../../Context/FeedContext";
import "./Supplier.css";

function EditSupplier() {
  const { t } = useTranslation();
  const { id } = useParams();

  const { getTreatmentMenue } = useContext(TreatmentContext);
  const { getFodderMenue } = useContext(Feedcontext);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feeds, setFeeds] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  const getHeaders = () => {
    const token = localStorage.getItem("Authorization");
    return {
      Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
    };
  };

  // عرف formik أولاً
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      notes: "",
      treatmentId: "",  // مفرد بدل array
      feedId: "",       // مفرد بدل array
    },
    onSubmit: editSupplier,
  });

  async function fetchSupplier() {
    try {
      const { data } = await axios.get(
        `https://farm-project-bbzj.onrender.com/api/supplier/getSinglesuppliers/${id}`,
        { headers: getHeaders() }
      );
      if (data.status === "success") {
        const supplier = data.data.supplier;
        formik.setValues({
          name: supplier.name || "",
          email: supplier.email || "",
          phone: supplier.phone || "",
          company: supplier.company || "",
          notes: supplier.notes || "",
          treatmentId: supplier.treatmentIds?.[0] || "", // خذ أول عنصر لو موجود
          feedId: supplier.feedIds?.[0] || "",
        });
      }
    } catch (err) {
      setError(t("failed_to_load_supplier"));
    }
  }

  const fetchTreatments = async () => {
    try {
      const { data } = await getTreatmentMenue();
      if (data?.status === "success" && Array.isArray(data.data)) {
        setTreatments(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFeeds = async () => {
    try {
      const { data } = await getFodderMenue();
      if (data?.status === "success" && Array.isArray(data.data)) {
        setFeeds(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  async function loadData() {
    setIsFetching(true);
    await Promise.all([fetchSupplier(), fetchTreatments(), fetchFeeds()]);
    setIsFetching(false);
  }

  async function editSupplier(values) {
    setIsLoading(true);
    try {
      await axios.patch(
        `https://farm-project-bbzj.onrender.com/api/supplier/updatesupplier/${id}`,
        {
          name: values.name,
          email: values.email,
          phone: values.phone,
          company: values.company,
          notes: values.notes,
          treatmentIds: values.treatmentId ? [values.treatmentId] : [],
          feedIds: values.feedId ? [values.feedId] : [],
        },
        { headers: getHeaders() }
      );

      if (values.treatmentId) {
        await axios.put(
          `https://farm-project-bbzj.onrender.com/api/supplier/${id}/treatments/${values.treatmentId}`,
          {},
          { headers: getHeaders() }
        );
      }

      if (values.feedId) {
        await axios.put(
          `https://farm-project-bbzj.onrender.com/api/supplier/${id}/feeds/${values.feedId}`,
          {},
          { headers: getHeaders() }
        );
      }

      Swal.fire(t("success_title"), t("supplier_update_success"), "success");
    } catch (err) {
      setError(t("error_updating_supplier"));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isFetching) {
    return <div className="loading-message">{t("loading")}</div>;
  }

  return (
    <div className="treatment-container">
      <div className="treatment-header">
        <h1>{t("edit_supplier")}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={formik.handleSubmit} className="treatment-form">
        <div className="form-grid">
          {/* Supplier Details */}
          <div className="form-section">
            <h2>{t("supplier_details")}</h2>
            <div className="input-group">
              <label>{t("name")}</label>
              <input
                placeholder={t("placeholder_name")}
                {...formik.getFieldProps("name")}
              />
            </div>
            <div className="input-group">
              <label>{t("email")}</label>
              <input
                placeholder={t("placeholder_email")}
                {...formik.getFieldProps("email")}
              />
            </div>
            <div className="input-group">
              <label>{t("phone")}</label>
              <input
                placeholder={t("placeholder_phone")}
                {...formik.getFieldProps("phone")}
              />
            </div>
            <div className="input-group">
              <label>{t("company")}</label>
              <input
                placeholder={t("placeholder_company")}
                {...formik.getFieldProps("company")}
              />
            </div>
            <div className="input-group">
              <label>{t("notes")}</label>
              <textarea
                placeholder={t("placeholder_notes")}
                {...formik.getFieldProps("notes")}
              />
            </div>
          </div>

          {/* Treatments */}
          <div className="form-section">
            <h2>{t("treatments")}</h2>
            <div className="input-group">
              <label>{t("treatment")}</label>
              <select
                {...formik.getFieldProps("treatmentId")}
                disabled={isLoading}
              >
                <option value="">{t("select_treatment")}</option>
                {treatments.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Feeds */}
          <div className="form-section">
            <h2>{t("feeds")}</h2>
            <div className="input-group">
              <label>{t("feed")}</label>
              <select {...formik.getFieldProps("feedId")} disabled={isLoading}>
                <option value="">{t("select_feed")}</option>
                {feeds.map((feed) => (
                  <option key={feed._id} value={feed._id}>
                    {feed.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="form-actions">
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

export default EditSupplier;
