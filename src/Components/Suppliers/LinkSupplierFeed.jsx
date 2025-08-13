import React, { useEffect, useMemo, useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Feedcontext } from "../../Context/FeedContext"; // نفس الكونتكست اللي بتستخدميه

export default function LinkSupplierFeed() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // حالات التحميل والإرسال
  const [loading, setLoading] = useState({
    suppliers: true,
    feeds: true,
    submit: false,
  });
  const [error, setError] = useState("");

  // البيانات
  const [suppliers, setSuppliers] = useState([]);
  const [feeds, setFeeds] = useState([]);

  // المختار
  const [supplierId, setSupplierId] = useState("");
  const [feedId, setFeedId] = useState("");

  // من الكونتكست
  const { getFodderMenue } = useContext(Feedcontext);

  const getHeaders = useMemo(() => {
    return () => {
      const token = localStorage.getItem("Authorization");
      return {
        Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
      };
    };
  }, []);

  // 1) الموردين
  useEffect(() => {
    async function fetchSuppliers() {
      setLoading((p) => ({ ...p, suppliers: true }));
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
        setLoading((p) => ({ ...p, suppliers: false }));
      }
    }
    fetchSuppliers();
  }, [getHeaders]);

  // 2) الأعلاف
  useEffect(() => {
    async function fetchFeeds() {
      setLoading((p) => ({ ...p, feeds: true }));
      setError("");
      try {
        const { data } = await getFodderMenue();
        if (data?.status === "success" && Array.isArray(data.data)) {
          setFeeds(data.data);
        } else {
          setFeeds([]);
        }
      } catch (e) {
        const msg = e?.response?.data?.message || e.message;
        setError(msg);
      } finally {
        setLoading((p) => ({ ...p, feeds: false }));
      }
    }
    fetchFeeds();
  }, [getFodderMenue]);

  // 3) Query params (اختياري): ?supplierId=...&feedId=...
  useEffect(() => {
    const sId = searchParams.get("supplierId");
    const fId = searchParams.get("feedId");
    if (sId) setSupplierId(sId);
    if (fId) setFeedId(fId);
  }, [searchParams]);

  const canSubmit = supplierId && feedId && !loading.submit;

  async function handleLink() {
    if (!supplierId || !feedId) return;
    setLoading((p) => ({ ...p, submit: true }));
    setError("");

    try {
      await axios.put(
        `https://farm-project-bbzj.onrender.com/api/supplier/${supplierId}/feeds/${feedId}`,
        {},
        { headers: getHeaders() }
      );
      Swal.fire(
        t("success_title") || "Success",
        t("add_feed_success") || "Feed linked successfully.",
        "success"
      );
      navigate(`/editSupplier/${supplierId}`);
    } catch (e) {
      const apiMsg = e?.response?.data?.message || e.message;
      setError(apiMsg);
      Swal.fire(
        t("error_title") || "Error",
        apiMsg || t("error_feed") || "Failed to link feed.",
        "error"
      );
    } finally {
      setLoading((p) => ({ ...p, submit: false }));
    }
  }

  return (
    <div className="treatment-container" style={{ maxWidth: 720, margin: "0 auto" }}>
      <div className="treatment-header">
        <h1>{t("link_feed_to_supplier") || "Link Feed to Supplier"}</h1>
      </div>

      {error ? <div className="error-message" style={{ marginBottom: 12 }}>{error}</div> : null}

      <div className="treatment-form">
        <div className="form-grid">
          {/* المورد */}
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

          {/* الأعلاف */}
          <div className="form-section">
            <h2>{t("feed") || "Feed"}</h2>
            <div className="input-group">
              <label>{t("select_feed") || "Select feed"}</label>
              <select
                value={feedId}
                onChange={(e) => setFeedId(e.target.value)}
                disabled={loading.feeds || loading.submit}
              >
                <option value="">{t("select_feed") || "Select feed"}</option>
                {feeds.map((fd) => (
                  <option key={fd._id} value={fd._id}>
                    {fd.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

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