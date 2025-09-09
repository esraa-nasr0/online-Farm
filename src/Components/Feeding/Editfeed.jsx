// Editfeed.js - الإصدار المحسن
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { IoIosSave } from 'react-icons/io';
import './Feeding.css';
import { useTranslation } from "react-i18next";

export default function Editfeed() {
  let { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState({ suppliers: false, feed: false });

  const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
    const formattedToken = Authorization?.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
    return { Authorization: formattedToken };
  };

  // جلب بيانات الموردين
  useEffect(() => {
    async function fetchSuppliers() {
      setLoading(prev => ({ ...prev, suppliers: true }));
      setError("");
      try {
        const { data } = await axios.get(
          "https://farm-project-bbzj.onrender.com/api/supplier/getallsuppliers",
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
  }, []);

  // جلب بيانات العلف الحالية
  useEffect(() => {
    async function fetchFeed() {
      setLoading(prev => ({ ...prev, feed: true }));
      const headers = getHeaders();
      try {
        const { data } = await axios.get(
          `https://farm-project-bbzj.onrender.com/api/feed/getsinglefeed/${id}`,
          { headers }
        );
        if (data.data.feed) {
          const feed = data.data.feed;
          formik.setValues({
            name: feed.name || '',
            price: feed.price || '',
            type: feed.type || '',
            concentrationOfDryMatter: feed.concentrationOfDryMatter || '',
            quantity: feed.quantity || '',
            supplierId: feed.supplierId || '',
          });
        }
      } catch (err) {
        setError(t("error_fetch_feed"));
        console.error(err);
      } finally {
        setLoading(prev => ({ ...prev, feed: false }));
      }
    }
    fetchFeed();
  }, [id]);

  // تحقق من الصحة
  const validationSchema = Yup.object({
    name: Yup.string().required(t('name_required')),
    type: Yup.string().required(t('type_required')),
    price: Yup.number().required(t('price_required')),
    concentrationOfDryMatter: Yup.number().required(t('dry_matter_required')),
    quantity: Yup.number().required(t('quantity_required')),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      type: "",
      price: "",
      concentrationOfDryMatter: "",
      quantity: "",
      supplierId: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const headers = getHeaders();
      try {
        setIsLoading(true);
        const dataToSubmit = {
          name: values.name,
          type: values.type,
          price: Number(values.price),
          quantity: Number(values.quantity),
          concentrationOfDryMatter: Number(values.concentrationOfDryMatter),
          supplierId: values.supplierId,
        };

        const response = await axios.patch(
          `https://farm-project-bbzj.onrender.com/api/feed/updatefeed/${id}`,
          dataToSubmit,
          { headers }
        );
        
        if (response.data.status === "success") {
          Swal.fire({
            title: t("success_title"),
            text: t("submit_success_message"),
            icon: "success",
            confirmButtonText: t("ok"),
          }).then(() => navigate('/feedingTable'));
        }
      } catch (err) {
        Swal.fire({
          title: t("error_title"),
          text: err.response?.data?.message || t("submit_error_message"),
          icon: "error",
          confirmButtonText: t("ok"),
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="feeding-container">
      <div className="feeding-header container">
        <h1>{t("edit_feed")}</h1>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={formik.handleSubmit} className="feeding-form container">
        <div className="form-grid">
          <div className="form-section">
            <h2>{t("feed_info")}</h2>

            <div className="input-group">
              <label htmlFor="name">{t("Name")}</label>
              <input
                {...formik.getFieldProps("name")}
                placeholder={t('enter_feed_name')}
                id="name"
                type="text"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-danger">{formik.errors.name}</p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="type">{t("type")}</label>
              <input
                {...formik.getFieldProps("type")}
                placeholder={t('enter_feed_type')}
                id="type"
                type="text"
              />
              {formik.touched.type && formik.errors.type && (
                <p className="text-danger">{formik.errors.type}</p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="price">{t("price_per_ton")}</label>
              <input
                {...formik.getFieldProps("price")}
                placeholder={t('enter_price')}
                id="price"
                type="text"
              />
              {formik.touched.price && formik.errors.price && (
                <p className="text-danger">{formik.errors.price}</p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="concentrationOfDryMatter">
                {t('dry_matter_concentration')} (%)
              </label>
              <input
                {...formik.getFieldProps("concentrationOfDryMatter")}
                placeholder={t('enter_dry_matter')}
                id="concentrationOfDryMatter"
                type="text"
              />
              {formik.touched.concentrationOfDryMatter && 
              formik.errors.concentrationOfDryMatter && (
                <p className="text-danger">{formik.errors.concentrationOfDryMatter}</p>
              )}
            </div>
            
            <div className="input-group">
              <label htmlFor="quantity">{t('quantity')} </label>
              <input
                {...formik.getFieldProps("quantity")}
                placeholder={t('enter_quantity')}
                id="quantity"
                type="text"
              />
              {formik.touched.quantity && formik.errors.quantity && (
                <p className="text-danger">{formik.errors.quantity}</p>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2>{t("supplier")}</h2>
            <div className="input-group">
              <label>{t("select_supplier")}</label>
              <select {...formik.getFieldProps("supplierId")}>
                <option value="">{t("select_supplier")}</option>
                {suppliers.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} {s.company ? `— ${s.company}` : ""}
                  </option>
                ))}
              </select>
              {formik.touched.supplierId && formik.errors.supplierId && (
                <p className="text-danger">{formik.errors.supplierId}</p>
              )}
            </div>
          </div>
        </div>

        <div className="form-actions">
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