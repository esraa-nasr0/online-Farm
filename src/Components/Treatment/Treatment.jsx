// src/pages/Treatment.jsx
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import "./Treatment.css";

// ترويسة ثابتة لقراءة التوكن
const buildAuthHeaders = () => {
  const token = localStorage.getItem("Authorization") || "";
  if (!token) return {};
  return { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` };
};

const API = "https://farm-project-bbzj.onrender.com";

export default function Treatment() {
  const { t } = useTranslation();

  // حالات عامة
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [treatmentData, setTreatmentData] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // حالات المورّد
  const [suppliers, setSuppliers] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [loading, setLoading] = useState({ suppliers: false });

  // جلب المورّدين مرة واحدة
  useEffect(() => {
    let cancelled = false;

    async function fetchSuppliers() {
      try {
        setLoading((p) => ({ ...p, suppliers: true }));
        setError(null);

        const { data } = await axios.get(
          `${API}/api/supplier/getallsuppliers?limit=1000&page=1`,
          { headers: buildAuthHeaders() }
        );

        if (!cancelled) {
          setSuppliers(data?.status === "success" ? data?.data?.suppliers || [] : []);
        }
      } catch (e) {
        if (!cancelled) setError(e?.response?.data?.message || e.message);
      } finally {
        if (!cancelled) setLoading((p) => ({ ...p, suppliers: false }));
      }
    }

    fetchSuppliers();
    return () => { cancelled = true; };
  }, []);

  // التحقق
  const validationSchema = Yup.object({
    name: Yup.string().required(t("name_required") || "Name is required"),
    type: Yup.string().required(t("type_required") || "Type is required"),
    bottles: Yup.number().nullable().typeError(t("must_be_number") || "Must be a number"),
    volumePerBottle: Yup.number().nullable().typeError(t("must_be_number") || "Must be a number"),
    bottlePrice: Yup.number().nullable().typeError(t("must_be_number") || "Must be a number"),
    expireDate: Yup.date().nullable().typeError(t("must_be_date") || "Must be a date"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      type: "",
      bottles: "",
      volumePerBottle: "",
      unitOfMeasure: "",
      bottlePrice: "",
      expireDate: "",
      supplierId: "",
    },
    validationSchema,
    onSubmit: submitTreatment,
  });

  // إرسال النموذج
  async function submitTreatment(values) {
    if (isSubmitted) return;

    try {
      setIsLoading(true);
      setError(null);

      // تجهيز البيانات (تضمين supplierId من الحالة أو فورميك)
      const payload = {
        ...values,
        supplierId: values.supplierId || supplierId || "",
      };

      // تنظيف الأرقام لو فاضية
      if (payload.bottles === "") delete payload.bottles;
      if (payload.volumePerBottle === "") delete payload.volumePerBottle;
      if (payload.bottlePrice === "") delete payload.bottlePrice;
      if (!payload.expireDate) delete payload.expireDate;

      const { data } = await axios.post(
        `${API}/api/treatment/addtreatment`,
        payload,                                  // ✅ جسم الطلب الصحيح
        { headers: buildAuthHeaders() }           // ✅ الإعدادات (الهيدر) كبراميتر ثالث
      );

      if (data?.status === "success") {
        setIsSubmitted(true);
        setTreatmentData(data.data.treatment);
        Swal.fire({
          title: t("success") || "Success",
          text: t("treatment_success_message") || "Treatment added successfully",
          icon: "success",
          confirmButtonText: t("ok") || "OK",
        });
        formik.resetForm();
        setSupplierId("");
      }
    } catch (err) {
      setError(err?.response?.data?.message || t("error_message") || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  const resetForm = () => {
    formik.resetForm();
    setIsSubmitted(false);
    setTreatmentData(null);
    setSupplierId("");
    setError(null);
  };

  return (
    <div className="treatment-container">
      <div className="treatment-header container">
        <h1>{t("Pharmacy") || "Pharmacy"}</h1>
      </div>

      {error && <div className="error-message container">{error}</div>}

      {treatmentData && (
        <div className="success-message container">
          <h3>{t("Pharmacy_added_successfully") || "Treatment added successfully"}</h3>
          <p>{treatmentData?.name}</p>
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="treatment-form container mt-4">
        <div className="form-grid">
          {/* العمود الأيسر */}
          <div className="form-section">
            <h2>{t("Pharmacy_details") || "Pharmacy Details"}</h2>

            <div className="input-group">
              <label htmlFor="name">{t("name") || "Name"}</label>
              <input
                id="name"
                type="text"
                placeholder={t("enter_treatment_name") || "Enter The Treatment Name"}
                disabled={isSubmitted}
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="error-message">{formik.errors.name}</p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="type">{t("type") || "Type"}</label>
              <input
                id="type"
                type="text"
                placeholder={t("enter_treatment_type") || "Enter The Treatment Type"}
                disabled={isSubmitted}
                {...formik.getFieldProps("type")}
              />
              {formik.touched.type && formik.errors.type && (
                <p className="error-message">{formik.errors.type}</p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="bottles">{t("bottles") || "Bottles"}</label>
              <input
                id="bottles"
                type="number"
                placeholder={t("enter_treatment_bottles") || "Enter number of bottles"}
                disabled={isSubmitted}
                {...formik.getFieldProps("bottles")}
              />
              {formik.touched.bottles && formik.errors.bottles && (
                <p className="error-message">{formik.errors.bottles}</p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="volumePerBottle">{t("volumePerBottle") || "Volume per Bottle"}</label>
              <input
                id="volumePerBottle"
                type="number"
                placeholder={t("enter_volume_per_bottle") || "Enter volume per bottle"}
                disabled={isSubmitted}
                {...formik.getFieldProps("volumePerBottle")}
              />
              {formik.touched.volumePerBottle && formik.errors.volumePerBottle && (
                <p className="error-message">{formik.errors.volumePerBottle}</p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="unitOfMeasure">{t("unitOfMeasure") || "Unit of Measure"}</label>
              <select
                id="unitOfMeasure"
                disabled={isSubmitted}
                {...formik.getFieldProps("unitOfMeasure")}
              >
                <option value="">{t("select_unit_of_measure") || "Select unit of measure"}</option>
                <option value="ml">{t("ml") || "ml"}</option>
                <option value="cm³">{t("cm³") || "cm³"}</option>
                <option value="ampoule">{t("ampoule") || "Ampoule"}</option>
              </select>
              {formik.touched.unitOfMeasure && formik.errors.unitOfMeasure && (
                <p className="error-message">{formik.errors.unitOfMeasure}</p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="bottlePrice">{t("bottlePrice") || "Bottle Price"}</label>
              <input
                id="bottlePrice"
                type="number"
                placeholder={t("enter_treatment_bottle_Price") || "Enter bottle price"}
                disabled={isSubmitted}
                {...formik.getFieldProps("bottlePrice")}
              />
              {formik.touched.bottlePrice && formik.errors.bottlePrice && (
                <p className="error-message">{formik.errors.bottlePrice}</p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="expireDate">{t("expire_date") || "Expire Date"}</label>
              <input
                id="expireDate"
                type="date"
                disabled={isSubmitted}
                {...formik.getFieldProps("expireDate")}
              />
              {formik.touched.expireDate && formik.errors.expireDate && (
                <p className="error-message">{formik.errors.expireDate}</p>
              )}
            </div>
          </div>

          {/* عمود المورّد */}
          <div className="form-section">
            <h2>{t("supplier") || "Supplier"}</h2>
            <div className="input-group">
              <label>{t("select_supplier") || "Select supplier"}</label>
              <select
                value={supplierId}
                disabled={loading.suppliers || isSubmitted}
                onChange={(e) => {
                  setSupplierId(e.target.value);
                  // لو حابة تخليه داخل الفورميك برضه
                  formik.setFieldValue("supplierId", e.target.value);
                }}
              >
                <option value="">
                  {loading.suppliers
                    ? (t("loading") || "Loading…")
                    : (t("select_supplier") || "Select supplier")}
                </option>
                {suppliers.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} {s.company ? `— ${s.company}` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="save-button"
            disabled={isLoading}
          >
            {isLoading ? (t("loading") || "Loading...") : (t("save") || "Save")}
          </button>

          {isSubmitted && (
            <button type="button" className="save-button" onClick={resetForm}>
              {t("add_new_treatment") || "Add new treatment"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}