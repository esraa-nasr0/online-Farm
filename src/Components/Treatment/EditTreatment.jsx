import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { IoIosSave } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Treatment.css';

function EditTreatment() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
    const formattedToken = Authorization.startsWith("Bearer ")
      ? Authorization
      : `Bearer ${Authorization}`;
    return { Authorization: formattedToken };
  };

  async function submitTreatment(values) {
  const headers = getHeaders();
  setIsLoading(true);
  setError(null);

  const payload = {
    name: values.name,
    type: values.type,
    bottles: Number(values.bottles),
    volumePerBottle: Number(values.volumePerBottle),
    unitOfMeasure: values.unitOfMeasure,
    bottlePrice: Number(values.bottlePrice),
    expireDate: values.expireDate,
  };

  try {
    const { data } = await axios.patch(
      `https://farm-project-bbzj.onrender.com/api/treatment/updatetreatment/${id}`,
      payload,
      { headers }
    );

    if (data.status === "success") {
      Swal.fire({ title: t("successTitle"), text: t("treatmentUpdated"), icon: "success", confirmButtonText: t("ok") });
      // اختياري: حطي كويري بسيط يضمن إعادة الجلب
      navigate(`/treatmentTable?ts=${Date.now()}`);
    }
  } catch (err) {
    setError(err.response?.data?.message || t("errorOccurred"));
  } finally {
    setIsLoading(false);
  }
}
  useEffect(() => {
    async function fetchTreatment() {
      const headers = getHeaders();
      setError(null);
      try {
        const { data } = await axios.get(
          `https://farm-project-bbzj.onrender.com/api/treatment/getsingletreatment/${id}`,
          { headers }
        );
        if (data?.data?.treatment) {
          const treatment = data.data.treatment;
          formik.setValues({
            name: treatment.name || '',
            type: treatment.type || '',
            bottles: treatment.stock?.bottles || '',
            volumePerBottle: treatment.stock?.volumePerBottle || '',
            unitOfMeasure: treatment.stock?.unitOfMeasure || '',
            bottlePrice: treatment.pricing?.bottlePrice || '',
            expireDate: treatment.expireDate?.split("T")[0] || '',
          });
        } else {
          throw new Error("Unexpected API response structure");
        }
      } catch (error) {
        setError(t("fetchError"));
      }
    }
    fetchTreatment();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      name: "",
      type: "",
      bottles: "",
      volumePerBottle: "",
      unitOfMeasure:"",
      bottlePrice: "",
      expireDate: "",
    },
    onSubmit: submitTreatment,
  });

  return (
    <div className="treatment-container">
      <div className="treatment-header container">
        <h1>{t("editTreatment")}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={formik.handleSubmit} className="treatment-form container">
        <div className="form-grid">
          <div className="form-section">
            <h2>{t("treatment_details")}</h2>

            <div className="input-group">
              <label htmlFor="name">{t("name")}</label>
              <input
                id="name"
                type="text"
                {...formik.getFieldProps("name")}
                placeholder={t("enter_treatment_name")}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="error-message">{formik.errors.name}</p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="type">{t("type")}</label>
              <input
                id="type"
                type="text"
                {...formik.getFieldProps("type")}
                placeholder={t("enter_treatment_type")}
              />
              {formik.touched.type && formik.errors.type && (
                <p className="error-message">{formik.errors.type}</p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="bottles">{t("bottles")}</label>
              <input
                id="bottles"
                type="number"
                {...formik.getFieldProps("bottles")}
                placeholder={t("enter_treatment_bottles")}
              />
              {formik.touched.bottles && formik.errors.bottles && (
                <p className="error-message">{formik.errors.bottles}</p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="volumePerBottle">{t("volumePerBottle")}</label>
              <input
                id="volumePerBottle"
                type="number"
                {...formik.getFieldProps("volumePerBottle")}
                placeholder={t("enter_volume_per_bottle")}
              />
              {formik.touched.volumePerBottle && formik.errors.volumePerBottle && (
                <p className="error-message">{formik.errors.volumePerBottle}</p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="unitOfMeasure">{t("unitOfMeasure")}</label>
              <select
                id="unitOfMeasure"
                {...formik.getFieldProps("unitOfMeasure")}
                placeholder={t("select_unit_of_measure")}
              >
                <option value="">{t("select_unit_of_measure")}</option>
                <option value="ml">{t("ml")}</option>
                <option value="cm³">{t("cm³")}</option>
                <option value="ampoule">{t("ampoule")}</option>
                </select>
              {formik.touched.unitOfMeasure && formik.errors.unitOfMeasure && (
                <p className="error-message">{formik.errors.unitOfMeasure}</p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="bottlePrice">{t("bottlePrice")}</label>
              <input
                id="bottlePrice"
                type="number"
                {...formik.getFieldProps("bottlePrice")}
                placeholder={t("enter_treatment_bottle_Price")}
              />
              {formik.touched.bottlePrice && formik.errors.bottlePrice && (
                <p className="error-message">{formik.errors.bottlePrice}</p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="expireDate">{t("expire_date")}</label>
              <input
                id="expireDate"
                type="date"
                {...formik.getFieldProps("expireDate")}
              />
              {formik.touched.expireDate && formik.errors.expireDate && (
                <p className="error-message">{formik.errors.expireDate}</p>
              )}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="save-button"
            disabled={isLoading}
          >
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

export default EditTreatment;
