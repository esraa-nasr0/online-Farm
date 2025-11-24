import { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import axiosInstance from "../../api/axios";
import { IoIosSave } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { LocationContext } from "../../Context/LocationContext";
import { BreedContext } from "../../Context/BreedContext";
import { jwtDecode } from "jwt-decode";
import { getToken } from "../../utils/authToken";
import "./AnimalsDetails.css";

function EditAnimal() {
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [animalData, setAnimalData] = useState(null);
  const [locationSheds, setLocationSheds] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [isFattening, setIsFattening] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false); // ⬅️ سويتش إظهار الحقول الفارغة

  const { LocationMenue } = useContext(LocationContext);
  const { BreedMenue } = useContext(BreedContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toISOString().split("T")[0] : "";

  const convertToISO = (dateString) => {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    return isNaN(date) ? undefined : date.toISOString();
  };

  // ==== من يظهر وإمتى (إخفاء الحقول الفارغة) ====
  const hasValue = (v) => {
    if (v === undefined || v === null) return false;
    if (typeof v === "string") return v.trim() !== "";
    if (typeof v === "number") return true; // 0 يعتبر قيمة صحيحة
    if (typeof v === "object" && v !== null) {
      if ("years" in v && "months" in v && "days" in v) {
        return (Number(v.years) || 0) > 0 ||
               (Number(v.months) || 0) > 0 ||
               (Number(v.days) || 0) > 0;
      }
      return Object.values(v).some(hasValue);
    }
    return !!v;
  };

  const ShowIf = ({ value, children }) =>
    showEmpty || hasValue(value) ? children : null;

  // ===== Decode token to detect fattening mode =====
  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsFattening(decoded.registerationType === "fattening");
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // ===== Load menus =====
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { data } = await LocationMenue();
        if (data.status === "success" && Array.isArray(data.data.locationSheds)) {
          setLocationSheds(data.data.locationSheds);
        }
      } catch {
        setError("Failed to load location sheds");
      }
    };
    fetchLocation();
  }, [LocationMenue]);

  useEffect(() => {
    const fetchBreed = async () => {
      try {
        const { data } = await BreedMenue();
        if (data.status === "success" && Array.isArray(data.data.breeds)) {
          setBreeds(data.data.breeds);
        }
      } catch {
        setError("Failed to load breeds data");
      }
    };
    fetchBreed();
  }, [BreedMenue]);

  // ===== Fetch current animal =====
  async function fetchAnimal() {
    try {
      let { data } = await axiosInstance.get(
        `/animal/getsinglanimals/${id}`
      );

      if (data.status === "success") {
        const animal = data.data.animal;

        // Calculate age from birthDate
        let age = { years: 0, months: 0, days: 0 };
        if (animal.birthDate) {
          const birthDate = new Date(animal.birthDate);
          const today = new Date();

          let years = today.getFullYear() - birthDate.getFullYear();
          let months = today.getMonth() - birthDate.getMonth();
          let days = today.getDate() - birthDate.getDate();

          if (days < 0) {
            months--;
            days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
          }
          if (months < 0) {
            years--;
            months += 12;
          }
          age = { years, months, days };
        }

        formik.setValues({
          tagId: animal.tagId || "",
          animalType: animal.animalType || "",
          breed: animal.breed?._id || "",
          gender: animal.gender || "",
          motherId: animal.motherId || "",
          fatherId: animal.fatherId || "",
          birthDate: formatDate(animal.birthDate),
          locationShedName: animal.locationShed?._id || "",
          female_Condition: animal.female_Condition || "",
          animaleCondation: animal.animaleCondation || "",
          traderName: animal.traderName || "",
          purchaseDate: formatDate(animal.purchaseDate),
          purchasePrice: animal.purchasePrice ?? "",
          teething: animal.teething || "",
          marketValue: animal.marketValue ?? "",
          age,
        });

        setAnimalData(animal);
      } else {
        throw new Error(data.message || "Failed to fetch animal");
      }
    } catch (error) {
      console.error("Error fetching animal:", error);
      setError(error.response?.data?.message || "Failed to load animal data");
    }
  }

  useEffect(() => {
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      setError("Invalid animal ID");
      return;
    }
    fetchAnimal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ===== Submit (PATCH) =====
  async function editAnimal(values) {
    setIsLoading(true);
    try {
      const updatedValues = {
        ...values,
        birthDate: convertToISO(values.birthDate),
        purchaseDate: convertToISO(values.purchaseDate),
        locationShed: values.locationShedName ? { _id: values.locationShedName } : undefined,
        breed: values.breed ? { _id: values.breed } : undefined,
      };

      // Strip undefined + strip UI-only fields
      const payload = Object.fromEntries(
        Object.entries(updatedValues).filter(
          ([k, v]) => v !== undefined && !["locationShedName"].includes(k)
        )
      );

      const { data } = await axiosInstance.patch(
        `/animal/updateanimal/${id}`,
        payload
      );

      if (data.status === "success") {
        setAnimalData(data.data.animal);
        Swal.fire({
          title: t("success_title"),
          text: t("animal_update_success"),
          icon: "success",
          confirmButtonText: t("ok"),
        });
        navigate("/animals");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "An error occurred while processing your request";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  // ===== Formik =====
  const formik = useFormik({
    initialValues: {
      tagId: "",
      animalType: "",
      breed: "",
      gender: "",
      motherId: "",
      fatherId: "",
      birthDate: "",
      locationShedName: "",
      female_Condition: "",
      animaleCondation: "",
      traderName: "",
      purchaseDate: "",
      purchasePrice: "",
      teething: "",
      marketValue: "",
      age: { years: 0, months: 0, days: 0 },
    },
    onSubmit: (values) => editAnimal(values),
  });

  // ===== Visibility logic: show sections if they have data (even if selector not chosen) =====
  const hasPurchaseData =
    !!(formik.values.traderName?.trim() ||
       formik.values.purchaseDate ||
       (formik.values.purchasePrice !== "" && formik.values.purchasePrice != null) ||
       formik.values.teething);

  const hasBornAtFarmData =
    !!(formik.values.motherId?.trim() ||
       formik.values.fatherId?.trim() ||
       formik.values.birthDate ||
       formik.values.marketValue !== "" && formik.values.marketValue != null);

  const shouldShowPurchaseSection =
    formik.values.animaleCondation === "purchase" || hasPurchaseData;

  const shouldShowBornSection =
    (!isFattening) && (formik.values.animaleCondation === "born at farm" || hasBornAtFarmData);

  const shouldShowFemaleCondition =
    (!isFattening) && (formik.values.gender === "female" || !!formik.values.female_Condition?.trim());

  return (
    <div className="animal-details-container">
      <div className="animal-details-header container">
        <h1>{t("edit_animal")}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* سويتش إظهار/إخفاء الحقول الفارغة */}
      <div className="form-actions" style={{ marginBottom: 12 }}>
        <label style={{ display: "inline-flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={showEmpty}
            onChange={() => setShowEmpty((v) => !v)}
          />
          {showEmpty ? (t("hide_empty_fields") || "إخفاء الحقول الفارغة")
                     : (t("show_empty_fields") || "إظهار الحقول الفارغة")}
        </label>
      </div>

      <form onSubmit={formik.handleSubmit} className="animal-form container">
        <div className="form-grid">
          {/* ===== Basic Info ===== */}
          <div className="form-section">
            <h2>{t("basic_info")}</h2>

            <ShowIf value={formik.values.tagId}>
              <div className="input-group">
                <label htmlFor="tagId">{t("tag_id")}</label>
                <input
                  type="text"
                  id="tagId"
                  name="tagId"
                  value={formik.values.tagId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={t("enter_tag_id")}
                />
              </div>
            </ShowIf>

            <ShowIf value={formik.values.breed}>
              <div className="input-group">
                <label htmlFor="breed">{t("breed")}</label>
                <select
                  id="breed"
                  name="breed"
                  value={formik.values.breed}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">{t("select_breed")}</option>
                  {breeds.map((breed) => (
                    <option key={breed._id} value={breed._id}>
                      {breed.breedName}
                    </option>
                  ))}
                </select>
              </div>
            </ShowIf>

            <ShowIf value={formik.values.locationShedName}>
              <div className="input-group">
                <label htmlFor="locationShedName">{t("location_shed")}</label>
                <select
                  id="locationShedName"
                  name="locationShedName"
                  value={formik.values.locationShedName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">{t("select_location_shed")}</option>
                  {locationSheds.map((shed) => (
                    <option key={shed._id} value={shed._id}>
                      {shed.locationShedName}
                    </option>
                  ))}
                </select>
              </div>
            </ShowIf>

            {/* العمر: اعرض البلوك كله لو فيه أي قيمة (>0) */}
            <ShowIf value={formik.values.age}>
              <div className="input-group">
                <label>{t("age")}</label>
                <div className="age-input-container">
                  <ShowIf value={formik.values.age.years}>
                    <div className="age-input">
                      <label htmlFor="age-years">{t("years")}</label>
                      <input
                        type="number"
                        id="age-years"
                        name="age.years"
                        min="0"
                        value={formik.values.age.years}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                  </ShowIf>

                  <ShowIf value={formik.values.age.months}>
                    <div className="age-input">
                      <label htmlFor="age-months">{t("months")}</label>
                      <input
                        type="number"
                        id="age-months"
                        name="age.months"
                        min="0"
                        max="11"
                        value={formik.values.age.months}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                  </ShowIf>

                  <ShowIf value={formik.values.age.days}>
                    <div className="age-input">
                      <label htmlFor="age-days">{t("days")}</label>
                      <input
                        type="number"
                        id="age-days"
                        name="age.days"
                        min="0"
                        max="30"
                        value={formik.values.age.days}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                  </ShowIf>
                </div>
              </div>
            </ShowIf>
          </div>

          {/* ===== Animal Details ===== */}
          <div className="form-section">
            <h2>{t("animal_details")}</h2>

            <ShowIf value={formik.values.animalType}>
              <div className="input-group">
                <label htmlFor="animalType">{t("animal_type")}</label>
                <select
                  id="animalType"
                  name="animalType"
                  value={formik.values.animalType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">{t("select_animal_type")}</option>
                  <option value="goat">{t("goat")}</option>
                  <option value="sheep">{t("sheep")}</option>
                </select>
              </div>
            </ShowIf>

            <ShowIf value={formik.values.gender}>
              <div className="input-group">
                <label htmlFor="gender">{t("gender")}</label>
                <select
                  id="gender"
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">{t("select_gender")}</option>
                  <option value="female">{t("female")}</option>
                  <option value="male">{t("male")}</option>
                </select>
              </div>
            </ShowIf>

            {shouldShowFemaleCondition && (
              <ShowIf value={formik.values.female_Condition}>
                <div className="input-group">
                  <label htmlFor="female_Condition">{t("female_condition")}</label>
                  <input
                    type="text"
                    id="female_Condition"
                    name="female_Condition"
                    value={formik.values.female_Condition}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t("enter_female_condition")}
                  />
                </div>
              </ShowIf>
            )}
          </div>

          {/* ===== Acquisition Details ===== */}
          <div className="form-section">
            <h2>{t("acquisition_details")}</h2>

            <ShowIf value={formik.values.animaleCondation}>
              <div className="input-group">
                <label htmlFor="animaleCondation">{t("animal_condition")}</label>
                <select
                  id="animaleCondation"
                  name="animaleCondation"
                  value={formik.values.animaleCondation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">{t("select_condition")}</option>
                  <option value="purchase">{t("purchase")}</option>
                  {!isFattening && (
                    <option value="born at farm">{t("born_at_farm")}</option>
                  )}
                </select>
              </div>
            </ShowIf>

            {/* Purchase section */}
            {shouldShowPurchaseSection && (
              <>
                <ShowIf value={formik.values.traderName}>
                  <div className="input-group">
                    <label htmlFor="traderName">{t("trader_name")}</label>
                    <input
                      type="text"
                      id="traderName"
                      name="traderName"
                      value={formik.values.traderName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={t("enter_trader_name")}
                    />
                  </div>
                </ShowIf>

                <ShowIf value={formik.values.purchaseDate}>
                  <div className="input-group">
                    <label htmlFor="purchaseDate">{t("purchase_date")}</label>
                    <input
                      type="date"
                      id="purchaseDate"
                      name="purchaseDate"
                      value={formik.values.purchaseDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                </ShowIf>

                <ShowIf value={formik.values.purchasePrice}>
                  <div className="input-group">
                    <label htmlFor="purchasePrice">{t("purchase_price")}</label>
                    <input
                      type="number"
                      id="purchasePrice"
                      name="purchasePrice"
                      value={formik.values.purchasePrice}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={t("enter_purchase_price")}
                    />
                  </div>
                </ShowIf>
              </>
            )}

            {/* Born at farm section */}
            {shouldShowBornSection && (
              <>
                <ShowIf value={formik.values.motherId}>
                  <div className="input-group">
                    <label htmlFor="motherId">{t("mother_id")}</label>
                    <input
                      type="text"
                      id="motherId"
                      name="motherId"
                      value={formik.values.motherId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={t("enter_mother_id")}
                    />
                  </div>
                </ShowIf>

                <ShowIf value={formik.values.fatherId}>
                  <div className="input-group">
                    <label htmlFor="fatherId">{t("father_id")}</label>
                    <input
                      type="text"
                      id="fatherId"
                      name="fatherId"
                      value={formik.values.fatherId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={t("enter_father_id")}
                    />
                  </div>
                </ShowIf>

                <ShowIf value={formik.values.birthDate}>
                  <div className="input-group">
                    <label htmlFor="birthDate">{t("birth_date")}</label>
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      value={formik.values.birthDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                </ShowIf>

                <ShowIf value={formik.values.marketValue}>
                  <div className="input-group">
                    <label htmlFor="marketValue">{t("market_value")}</label>
                    <input
                      type="number"
                      id="marketValue"
                      name="marketValue"
                      value={formik.values.marketValue}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={t("enter_market_value")}
                    />
                  </div>
                </ShowIf>
              </>
            )}
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

export default EditAnimal;