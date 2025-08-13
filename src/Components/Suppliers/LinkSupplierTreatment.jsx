import React, { useEffect, useMemo, useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router-dom";
import { TreatmentContext } from "../../Context/TreatmentContext";

export default function LinkSupplierTreatment() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // حالات التحميل والأخطاء
  const [loading, setLoading] = useState({ suppliers: true, treatments: true, submit: false });
  const [error, setError] = useState("");

  // بيانات القوائم
  const [suppliers, setSuppliers] = useState([]);
  const [treatments, setTreatments] = useState([]);

  // القيم المختارة
  const [supplierId, setSupplierId] = useState("");
  const [treatmentId, setTreatmentId] = useState("");

  // من الكونتكست (نفس اللي بتستخدميه في الشاشات الأخرى)
  const { getTreatmentMenue } = useContext(TreatmentContext);

  const getHeaders = useMemo(() => {
    return () => {
      const token = localStorage.getItem("Authorization");
      return {
        Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
      };
    };
  }, []);

  // 1) احضري الموردين
  useEffect(() => {
    async function fetchSuppliers() {
      setLoading(prev => ({ ...prev, suppliers: true }));
      setError("");
      try {
        const { data } = await axios.get(
          "https://farm-project-bbzj.onrender.com/api/supplier/getallsuppliers?limit=1000&page=1",
          { headers: getHeaders() }
        );
        if (data?.status === "success") {
          setSuppliers(data.data.suppliers || []);
        } else {
          setSuppliers([]);
        }
      } catch (e) {
        const msg = e?.response?.data?.message || e.message;
        setError(msg);
      } finally {
        setLoading(prev => ({ ...prev, suppliers: false }));
      }
    }
    fetchSuppliers();
  }, [getHeaders]);

  // 2) احضري العلاجات
  useEffect(() => {
    async function fetchTreatments() {
      setLoading(prev => ({ ...prev, treatments: true }));
      setError("");
      try {
        const { data } = await getTreatmentMenue();
        if (data?.status === "success" && Array.isArray(data.data)) {
          setTreatments(data.data);
        } else {
          setTreatments([]);
        }
      } catch (e) {
        const msg = e?.response?.data?.message || e.message;
        setError(msg);
      } finally {
        setLoading(prev => ({ ...prev, treatments: false }));
      }
    }
    fetchTreatments();
  }, [getTreatmentMenue]);

  // 3) قراءة supplierId و treatmentId من الـ query string (اختياري)
  useEffect(() => {
    const sId = searchParams.get("supplierId");
    const tId = searchParams.get("treatmentId");
    if (sId) setSupplierId(sId);
    if (tId) setTreatmentId(tId);
  }, [searchParams]);

  const canSubmit = supplierId && treatmentId && !loading.submit;

  async function handleLink() {
    if (!supplierId || !treatmentId) return;
    setLoading(prev => ({ ...prev, submit: true }));
    setError("");

    try {
      await axios.put(
        `https://farm-project-bbzj.onrender.com/api/supplier/${supplierId}/treatments/${treatmentId}`,
        {},
        { headers: getHeaders() }
      );
      Swal.fire(t("success_title") || "Success", t("add_treatment_success") || "Treatment linked successfully.", "success");
      // رجوع اختياري لصفحة تعديل المورد
      navigate(`/editSupplier/${supplierId}`);
    } catch (e) {
      const apiMsg = e?.response?.data?.message || e.message;
      setError(apiMsg);
      Swal.fire(t("error_title") || "Error", apiMsg || (t("error_treatment") || "Failed to link treatment."), "error");
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  }

  return (
    <div className="treatment-container" style={{ maxWidth: 720, margin: "0 auto" }}>
      <div className="treatment-header">
        <h1>{t("link_treatment_to_supplier") || "Link Treatment to Supplier"}</h1>
      </div>

      {error ? <div className="error-message" style={{ marginBottom: 12 }}>{error}</div> : null}

      <div className="treatment-form">
        <div className="form-grid">
          {/* اختيار المورد */}
          <div className="form-section">
            <h2>{t("supplier") || "Supplier"}</h2>
            <div className="input-group">
              <label>{t("select_supplier") || "Select supplier"}</label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                disabled={loading.suppliers || loading.submit}
              >
                <option value="">{t("select_supplier") || "Select supplier"}</option>
                {suppliers.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} {s.company ? `— ${s.company}` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* اختيار العلاج */}
          <div className="form-section">
            <h2>{t("treatment") || "Treatment"}</h2>
            <div className="input-group">
              <label>{t("select_treatment") || "Select treatment"}</label>
              <select
                value={treatmentId}
                onChange={(e) => setTreatmentId(e.target.value)}
                disabled={loading.treatments || loading.submit}
              >
                <option value="">{t("select_treatment") || "Select treatment"}</option>
                {treatments.map((tr) => (
                  <option key={tr._id} value={tr._id}>
                    {tr.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* تنفيذ الربط */}
        <div className="form-actions" style={{ marginTop: 16 }}>
          <button
            type="button"
            className="save-button"
            disabled={!canSubmit}
            onClick={handleLink}
          >
            {loading.submit ? (t("loading") || "Loading...") : (t("link") || "Link")}
          </button>
        </div>
      </div>
    </div>
  );
}