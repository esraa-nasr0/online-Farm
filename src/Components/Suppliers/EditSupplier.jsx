import  { useEffect, useState, useContext, useCallback } from "react";
import { useFormik } from "formik";
import axiosInstance from "../../api/axios";
import { IoIosSave } from "react-icons/io";
import { useParams, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { Feedcontext } from "../../Context/FeedContext";
import "./Supplier.css";

function EditSupplier() {
  const { t } = useTranslation();
  const { id: supplierId } = useParams();

  const { getFodderMenue } = useContext(Feedcontext);
  
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feeds, setFeeds] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  // للاطلاع والعرض
  const [supplier, setSupplier] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      notes: "",
    },
    onSubmit: editSupplier,
    enableReinitialize: true, // مهم عشان يعيد حقن القيم بعد التحميل
  });

  const fetchSupplier = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/supplier/getSinglesuppliers/${supplierId}`
      );

      if (data.status === "success") {
        const s = data.data.supplier;
        setSupplier(s);

        // حقن حقول التعريف الأساسية فقط (متسيبيش feedId هنا لأن عندك feeds Array)
        formik.setValues(v => ({
          ...v,
          name: s.name || "",
          email: s.email || "",
          phone: s.phone || "",
          company: s.company || "",
          notes: s.notes || "",
        }));
      }
    } catch (err) {
      setError(t("failed_to_load_supplier"));
    }
  }, [supplierId, t]); // formik موجود بس مش لازم في deps

  const fetchFeeds = useCallback(async () => {
    try {
      const { data } = await getFodderMenue();
      if (data?.status === "success" && Array.isArray(data.data)) {
        setFeeds(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [getFodderMenue]);

  async function loadData() {
    setIsFetching(true);
    await Promise.all([fetchSupplier(), fetchFeeds()]);
    setIsFetching(false);
  }

  async function editSupplier(values) {
    setIsLoading(true);
    try {
      // تحديث بيانات المورد
      const { data } = await axiosInstance.patch(
        `/supplier/updatesupplier/${supplierId}`,
        {
          name: values.name,
          email: values.email,
          phone: values.phone,
          company: values.company,
          notes: values.notes,
        }
      );

      

      Swal.fire(t("success_title"), t("supplier_update_success"), "success");

      // رجّعي جِيبى المورد من جديد لتحديث القوائم الحالية
      await fetchSupplier();

      // فضّي اختيار الـ feed بعد الإضافة
      formik.setFieldValue("feedId", "");
    } catch (err) {
      setError(t("error_updating_supplier"));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplierId]);



  return (
    <div className="treatment-container">
      <div className="treatment-header container">
        <h1>{t("edit_supplier")}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={formik.handleSubmit} className="treatment-form container">
        <div className="form-grid">
          {/* تفاصيل المورد */}
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

          {/* إضافة علاج للمورد */}
          <div className="form-section">
            <h2>{t("treatments")}</h2>

            {/* قائمة العلاجات الحالية */}
            <div className="current-list">
              <h3>{t("current_treatments")}</h3>
              {supplier?.treatments?.length ? (
                <ul className="pill-list">
                  {supplier.treatments.map(tr => (
                    <li key={tr._id} className="pill mt-2">
                      {tr.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">{t("no_treatments")}</p>
              )}
            </div>
          </div>

          {/* الأعلاف */}
          <div className="form-section">
            <h2>{t("feeds")}</h2>

           
            {/* قائمة الأعلاف الحالية */}
            <div className="current-list">
              <h3>{t("current_feeds")}</h3>
              {supplier?.feeds?.length ? (
                <ul className="pill-list">
                  {supplier.feeds.map(fd => (
                    <li key={fd._id} className="pill mt-2">
                      {fd.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">{t("no_feeds")}</p>
              )}
            </div>
          </div>
        </div>

        {/* زر الحفظ */}
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