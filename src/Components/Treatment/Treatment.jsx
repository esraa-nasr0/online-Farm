import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { IoIosSave } from "react-icons/io";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import "./Treatment.css";

function Treatment() {
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [treatmentData, setTreatmentData] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const getHeaders = () => {
    const Authorization = localStorage.getItem("Authorization");
    const formattedToken = Authorization.startsWith("Bearer ")
      ? Authorization
      : `Bearer ${Authorization}`;
    return { Authorization: formattedToken };
  };

  async function submitTreatment(values) {
    if (isSubmitted) return;

    const headers = getHeaders();
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(
        `https://farm-project-bbzj.onrender.com/api/treatment/addtreatment`,
        values,
        { headers }
      );

      if (data.status === "success") {
        setIsLoading(false);
        setIsSubmitted(true);
        setTreatmentData(data.data.treatment);
        formik.resetForm();

        Swal.fire({
          title: t("success"),
          text: t("treatment_success_message"),
          icon: "success",
          confirmButtonText: t("ok"),
        });
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message || t("error_message"));
    }
  }

  const validationSchema = Yup.object({
    name: Yup.string().required(t("name_required")),
    type: Yup.string().required(t("type_required")),
    bottles: Yup.number().nullable().typeError(t("must_be_number")),

    volumePerBottle: Yup.number().nullable().typeError(t("must_be_number")),

    bottlePrice: Yup.number().nullable().typeError(t("must_be_number")),

    expireDate: Yup.date().nullable().typeError(t("must_be_date")),
  });

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
    validationSchema,
    onSubmit: submitTreatment,
  });

  const resetForm = () => {
    formik.resetForm();
    setIsSubmitted(false);
    setTreatmentData(null);
  };

  return (
    <div className="treatment-container">
      <div className="treatment-header">
        <h1>{t("Pharmacy")}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      {treatmentData && (
        <div className="success-message">
          <h3>{t("Pharmacy_added_successfully")}</h3>
          <p>{treatmentData.name}</p>
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="treatment-form">
        <div className="form-grid">
          <div className="form-section">
            <h2>{t("Pharmacy_details")}</h2>

            <div className="input-group">
              <label htmlFor="name">{t("name")}</label>
              <input
                id="name"
                type="text"
                {...formik.getFieldProps("name")}
                disabled={isSubmitted}
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
                disabled={isSubmitted}
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
                disabled={isSubmitted}
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
                disabled={isSubmitted}
                placeholder={t("enter_volume_per_bottle")}
              />
              {formik.touched.volumePerBottle &&
                formik.errors.volumePerBottle && (
                  <p className="error-message">
                    {formik.errors.volumePerBottle}
                  </p>
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
                disabled={isSubmitted}
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
                disabled={isSubmitted}
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
            onClick={() => {
              console.log("Form values:", formik.values);
              console.log("Form errors:", formik.errors);
              console.log("Form dirty:", formik.dirty);
              console.log("isSubmitted:", isSubmitted);
              formik.handleSubmit();
            }}
          >
            {isLoading ? "Loading..." : "Save"}
          </button>

          {isSubmitted && (
            <button type="button" className="save-button" onClick={resetForm}>
              {t("add_new_treatment")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default Treatment;
