import  { useContext, useState, useEffect } from "react";
import { useFormik } from "formik";
import { IoIosSave } from "react-icons/io";
import axios from "axios";
import { VaccineanimalContext } from "../../Context/VaccineanimalContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { LocationContext } from "../../Context/Locationshedcontext";
import { useTranslation } from "react-i18next";

function Vaccinebylocationshed() {
  const { getallVaccineanimal, getVaccineMenue } = useContext(VaccineanimalContext);
  const { getLocationtMenue } = useContext(LocationContext);
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [Vaccine, setVaccine] = useState([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoadingLocations(true);
      try {
        const { data } = await getLocationtMenue();
        if (data.status === "success") {
          const locationsData = data.data.locationSheds || data.data;
          setLocations(Array.isArray(locationsData) ? locationsData : []);
        }
      } catch (err) {
        console.error("Error details:", err);
        setError(t("failedLoadLocations"));
        setLocations([]);
      } finally {
        setIsLoadingLocations(false);
      }
    };
    fetchLocations();
  }, [getLocationtMenue]);

  useEffect(() => {
    const fetchVaccine = async () => {
      setIsLoadingLocations(true);
      try {
        const { data } = await getVaccineMenue();
        if (data.status === "success") {
          const vaccineData = data.data.vaccines || data.data;
          setVaccine(Array.isArray(vaccineData) ? vaccineData : []);
        }
      } catch (err) {
        console.error("Error details:", err);
        setError(t("failedLoadVaccines"));
        setVaccine([]);
      } finally {
        setIsLoadingLocations(false);
      }
    };
    fetchVaccine();
  }, [getVaccineMenue]);

  const getHeaders = () => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      navigate("/login");
      throw new Error("No authorization token found");
    }
    return {
      Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
    };
  };

  const formik = useFormik({
    initialValues: {
      vaccineId: "",
      date: "",
      locationShed: "",
      entryType: "",
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const headers = getHeaders();
        const dataToSend = {
          vaccineId: values.vaccineId,
          date: values.date,
          locationShed: values.locationShed,
          entryType: values.entryType,
        };

        const { data } = await axios.post(
          "https://api.mazraaonline.com/api/vaccine/AddVaccineForAnimals",
          dataToSend,
          { headers }
        );

        if (data.status === "SUCCESS") {
          setIsSubmitted(true); // ✅ فعل حالة "تم الحفظ"
          Swal.fire({
            title: t("success"),
            text: t("dataSubmittedSuccessfully"),
            icon: "success",
            confirmButtonText: t("ok"),
          })
        }
      } catch (err) {
        Swal.fire({
          title: t("error"),
          text: err.response?.data?.message || t("submitError"),
          icon: "error",
          confirmButtonText: t("ok"),
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="animal-details-container">
      <div className="animal-details-header container">
        <h1>{t("addByLocationTitle")}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={formik.handleSubmit} className="animal-form container">
        <div className="form-grid">
          <div className="form-section">
            <h2>{t("Vaccine Information")}</h2>
            
            <div className="input-group">
              <label htmlFor="vaccineId">{t("Vaccine Name")}</label>
              <select
                id="vaccineId"
                name="vaccineId"
                onChange={formik.handleChange}
                value={formik.values.vaccineId}
                required
              >
                <option value="">{t("selectVaccine")}</option>
                {isLoadingLocations ? (
                  <option disabled>{t("loadingVaccines")}...</option>
                ) : (
                  Vaccine.map((v) => (
                    <option key={v._id} value={v._id}>
                      {i18n.language === "ar"
                        ? v.vaccineType?.arabicName
                        : v.vaccineType?.englishName}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="date">{t("date")}</label>
              <input
                id="date"
                name="date"
                type="date"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.date}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2>{t("Location Information")}</h2>
            
            <div className="input-group">
              <label htmlFor="locationShed">{t("Location Shed")}</label>
              <select
                id="locationShed"
                name="locationShed"
                onChange={formik.handleChange}
                value={formik.values.locationShed}
                required
              >
                <option value="">{t("selectLocationShed")}</option>
                {isLoadingLocations ? (
                  <option disabled>{t("loadingLocations")}...</option>
                ) : (
                  locations.map((location) => (
                    <option key={location._id} value={location._id}>
                      {location.locationShedName}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="entryType">{t("Entry Type")}</label>
              <select
                id="entryType"
                name="entryType"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.entryType}
              >
                <option value="">{t("selectEntryType")}</option>
                <option value="Booster Dose">{t("boosterDose")}</option>
                <option value="Annual Dose">{t("annualDose")}</option>
                <option value="First Dose">{t("firstDose")}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="save-button"
            disabled={isLoading || isLoadingLocations}
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
        
                {isSubmitted && (
  <div className="form-actions">
    <button
      type="button"
      className="save-button"
      onClick={() => {
        formik.resetForm();
        setIsSubmitted(false);
      }}
    >
      {t("add_new_vaccine")}
    </button>
  </div>
)}
      </form>
    </div>
  );
}

export default Vaccinebylocationshed;