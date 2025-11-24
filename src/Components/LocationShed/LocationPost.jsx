import { useFormik } from "formik";
import  { useState } from "react";
import * as Yup from "yup";
import { IoIosSave } from "react-icons/io";
import axiosInstance from "../../api/axios";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./LocationShed.css";

function LocationPost() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function submitLocation(values, { resetForm }) {
    setIsLoading(true);
    setError(null);

    try {
      let { data } = await axiosInstance.post(
        `/location/addlocationshed`,
        values
      );

      if (data.status === "success") {
        setIsLoading(false);
        Swal.fire({
          title: "Success!",
          text: "Location data added successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });

        setIsSubmitted(true); // ✅ Show "Add New" button
        resetForm(); // ✅ Clear form
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message || "An error occurred");
    }
  }

  // **Formik Setup**
  let formik = useFormik({
    initialValues: {
      locationShedName: "",
    },
    validationSchema: Yup.object({
      locationShedName: Yup.string().required("Location Shed is required"),
    }),
    onSubmit: submitLocation,
  });

  return (
    <div className="animal-details-container  ">
      <div className="animal-details-header container">
        <h1>{t("location_shed")}</h1>
      </div>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={formik.handleSubmit} className="animal-form container">
        <div className="form-grid">
          <div className="form-section">
            <div className="input-group">
              <label className="label" htmlFor="locationShedName">
                {t("location_shed")}
              </label>
              <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.locationShedName}
                placeholder="Enter Location Shed"
                id="locationShedName"
                type="text"
                className="input2"
                name="locationShedName"
              />
              {formik.errors.locationShedName &&
                formik.touched.locationShedName && (
                  <p className="text-danger">
                    {formik.errors.locationShedName}
                  </p>
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
        {isSubmitted && (
          <div className="form-actions">
            <button
              type="button"
              className="save-button"
              onClick={() => setIsSubmitted(false)}
            >
              {t("add_new_location_shed")}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default LocationPost;
