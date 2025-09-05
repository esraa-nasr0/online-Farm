import { useEffect, useState, useContext, useMemo } from 'react';
import { useFormik } from 'formik';
import { IoIosSave } from "react-icons/io";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { NewvaccineContext } from '../../Context/NewvaccineContext';

function EditVaccine() {
  const { i18n, t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { getVaccinename } = useContext(NewvaccineContext);

  const [vaccineTypes, setVaccineTypes] = useState([]);        // كل اللقاحات (master list)
  const [filteredVaccines, setFilteredVaccines] = useState([]); // لقاحات بعد الفلترة بنوع المرض
  const [isLoading, setIsLoading] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [error, setError] = useState(null);

  const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
    const token = Authorization?.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
    return {
      Authorization: token,
      'Content-Type': 'application/json',
    };
  };

  // ===== Formik =====
  const formik = useFormik({
    initialValues: {
      diseaseType: '',
      vaccineTypeId: '',
      otherVaccineName: '',
      BoosterDose: '',
      AnnualDose: '',
      bottles: '',
      dosesPerBottle: '',
      bottlePrice: '',
      expiryDate: '',
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // شرط: إمّا يختار من القوائم أو يكتب اسم آخر
        if (!values.otherVaccineName?.trim() && !values.vaccineTypeId) {
          const msg = t("please_choose_vaccine_or_other") || "Please select a vaccine from the list or enter an Other Vaccine Name.";
          setIsLoading(false);
          setError(msg);
          Swal.fire(t("Error"), msg, "error");
          return;
        }

        const payload = {
          diseaseType: values.diseaseType || undefined,
          vaccineTypeId: values.vaccineTypeId || undefined,
          otherVaccineName: values.otherVaccineName?.trim() || undefined,
          BoosterDose: values.BoosterDose === '' ? undefined : Number(values.BoosterDose),
          AnnualDose: values.AnnualDose === '' ? undefined : Number(values.AnnualDose),
          bottles: values.bottles === '' ? undefined : Number(values.bottles),
          dosesPerBottle: values.dosesPerBottle === '' ? undefined : Number(values.dosesPerBottle),
          bottlePrice: values.bottlePrice === '' ? undefined : Number(values.bottlePrice),
          expiryDate: values.expiryDate || undefined,
        };

        const response = await axios.patch(
          `https://farm-project-bbzj.onrender.com/api/vaccine/UpdateVaccine/${id}`,
          payload,
          { headers: getHeaders() }
        );

        if (response.data.status === "success") {
          Swal.fire(t("Success"), t("Vaccine updated successfully"), "success")
            .then(() => navigate('/vaccineTable'));
        } else {
          throw new Error(response.data?.message || "Unexpected response");
        }
      } catch (err) {
        console.error("Update error:", err);
        const msg = err.response?.data?.message || t("An error occurred while updating data.");
        setError(msg);
        Swal.fire(t("Error"), msg, "error");
      } finally {
        setIsLoading(false);
      }
    }
  });

  const hasOther = useMemo(
    () => Boolean(formik.values.otherVaccineName?.trim()),
    [formik.values.otherVaccineName]
  );

  // ===== حمل القوائم + تفاصيل اللقاح =====
  useEffect(() => {
    const bootstrap = async () => {
      setIsBootstrapping(true);
      setError(null);
      try {
        // 1) حمل كل اللقاحات (أسماء + نوع المرض)
        const res = await getVaccinename(1, 200);
        const vaccines = res?.data?.data || [];
        setVaccineTypes(vaccines);
        setFilteredVaccines(vaccines);

        // 2) حمل بيانات اللقاح الحالي واملأ الفورم
        const details = await axios.get(
          `https://farm-project-bbzj.onrender.com/api/vaccine/GetSingleVaccine/${id}`,
          { headers: getHeaders() }
        );
        const vaccine = details.data?.data?.vaccine || {};

        const currentVaccineTypeId = vaccine.vaccineType?._id || '';
        const currentVaccineType = vaccines.find(v => v._id === currentVaccineTypeId);

        // حدّد diseaseType الحالي من كائن اللقاح أو استنتاجًا من نوع اللقاح
        const resolvedDiseaseType =
          vaccine.diseaseType ||
          (currentVaccineType
            ? (i18n.language === "ar" ? currentVaccineType.arabicDiseaseType : currentVaccineType.englishDiseaseType)
            : '');

        // جهّز فلترة اللقاحات حسب diseaseType إن وُجد
        if (resolvedDiseaseType) {
          const filtered = vaccines.filter(v =>
            (i18n.language === "ar" ? v.arabicDiseaseType : v.englishDiseaseType) === resolvedDiseaseType
          );
          setFilteredVaccines(filtered);
        } else {
          setFilteredVaccines(vaccines);
        }

        formik.setValues({
          diseaseType: resolvedDiseaseType || '',
          vaccineTypeId: currentVaccineTypeId,
          otherVaccineName: vaccine.otherVaccineName || '',
          BoosterDose: vaccine.BoosterDose ?? '',
          AnnualDose: vaccine.AnnualDose ?? '',
          bottles: vaccine.stock?.bottles ?? '',
          dosesPerBottle: vaccine.stock?.dosesPerBottle ?? '',
          bottlePrice: vaccine.pricing?.bottlePrice ?? '',
          expiryDate: vaccine.expiryDate ? vaccine.expiryDate.slice(0, 10) : '',
        });
      } catch (err) {
        console.error("Error loading data:", err);
        setError(t("Failed to load data"));
      } finally {
        setIsBootstrapping(false);
      }
    };
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, i18n.language]);

  // ===== عند كتابة Other Name: صَفّر القوائم وعطّلها =====
  useEffect(() => {
    if (hasOther) {
      if (formik.values.vaccineTypeId) formik.setFieldValue('vaccineTypeId', '', false);
      if (formik.values.diseaseType) formik.setFieldValue('diseaseType', '', false);
      setFilteredVaccines(vaccineTypes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasOther]);

  // ===== خيارات القوائم =====
  const diseaseTypes = useMemo(() => {
    const arr = vaccineTypes.map(v =>
      i18n.language === "ar" ? v.arabicDiseaseType : v.englishDiseaseType
    );
    return Array.from(new Set(arr)).filter(Boolean);
  }, [vaccineTypes, i18n.language]);

  const diseaseTypeOptions = useMemo(
    () => diseaseTypes.map(d => ({ value: d, label: d })),
    [diseaseTypes]
  );

  const vaccineOptions = useMemo(
    () =>
      filteredVaccines.map(item => ({
        value: item._id,
        label: i18n.language === "ar" ? item.arabicName : item.englishName,
        image: item.image ? `https://farm-project-bbzj.onrender.com/${item.image.replace(/\\/g, "/")}` : '',
      })),
    [filteredVaccines, i18n.language]
  );

  // ===== عند تغيير نوع المرض: فلترة اللقاحات + تصفير اختيار اللقاح =====
  const handleDiseaseTypeChange = (diseaseVal) => {
    if (!diseaseVal) {
      setFilteredVaccines(vaccineTypes);
      formik.setFieldValue('diseaseType', '');
      formik.setFieldValue('vaccineTypeId', '');
      return;
    }

    const filtered = vaccineTypes.filter(v =>
      (i18n.language === "ar" ? v.arabicDiseaseType : v.englishDiseaseType) === diseaseVal
    );
    setFilteredVaccines(filtered);
    formik.setFieldValue('diseaseType', diseaseVal);
    formik.setFieldValue('vaccineTypeId', '');
  };

  return (
    <div className="animal-details-container">
      <div className="animal-details-header container">
        <h1>{t("Edit Vaccine")}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={formik.handleSubmit} className="animal-form container">
        <div className="form-grid">
          {/* Section: Vaccine Info */}
          <div className="form-section">
            <h2>{t("Vaccine Information")}</h2>

            {/* Disease Type */}
            <div className="input-group">
              <label htmlFor="diseaseType">{t("Disease Type")}</label>
              <Select
                inputId="diseaseType"
                name="diseaseType"
                options={diseaseTypeOptions}
                value={diseaseTypeOptions.find(o => o.value === formik.values.diseaseType) || null}
                onChange={(opt) => {
                  if (formik.values.otherVaccineName) formik.setFieldValue('otherVaccineName', '');
                  handleDiseaseTypeChange(opt?.value || '');
                }}
                onBlur={() => formik.setFieldTouched('diseaseType', true)}
                isClearable
                placeholder={t("Select Disease Type")}
                classNamePrefix="react-select"
                className="react-select-container"
                isDisabled={hasOther || isBootstrapping}
              />
            </div>

            {/* Vaccine Name */}
            <div className="input-group">
              <label htmlFor="vaccineTypeId">{t("Vaccine Name")}</label>
              <Select
                inputId="vaccineTypeId"
                name="vaccineTypeId"
                options={vaccineOptions}
                value={vaccineOptions.find(o => o.value === formik.values.vaccineTypeId) || null}
                onChange={(selected) => {
                  if (formik.values.otherVaccineName) formik.setFieldValue('otherVaccineName', '');
                  formik.setFieldValue("vaccineTypeId", selected?.value || '');
                }}
                onBlur={() => formik.setFieldTouched("vaccineTypeId", true)}
                getOptionLabel={(e) => (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {e.image && (
                      <img
                        src={e.image}
                        alt={e.label}
                        width="30"
                        height="30"
                        style={{ borderRadius: 6, objectFit: "cover" }}
                      />
                    )}
                    <span>{e.label}</span>
                  </div>
                )}
                classNamePrefix="react-select"
                className="react-select-container"
                placeholder={
                  filteredVaccines.length === 0
                    ? t("No vaccines available")
                    : t("Select Vaccine")
                }
                isDisabled={hasOther || isBootstrapping || filteredVaccines.length === 0}
              />
            </div>

            {/* Other Vaccine Name */}
            <div className="input-group">
              <label htmlFor="otherVaccineName">{t("Other Vaccine Name")}</label>
              <input
                id="otherVaccineName"
                name="otherVaccineName"
                type="text"
                value={formik.values.otherVaccineName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t("Enter Other Vaccine Name")}
              />
              {hasOther && (
                <small style={{ opacity: 0.8 }}>
                  {t("Typing an 'Other vaccine name' disables the disease & vaccine lists.") }
                </small>
              )}
            </div>

            {/* Doses */}
            <div className="input-group">
              <label htmlFor="BoosterDose">{t("Booster Dose")}</label>
              <input
                id="BoosterDose"
                name="BoosterDose"
                type="number"
                min="0"
                value={formik.values.BoosterDose}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t("Enter Booster Dose")}
              />
            </div>

            <div className="input-group">
              <label htmlFor="AnnualDose">{t("Annual Dose")}</label>
              <input
                id="AnnualDose"
                name="AnnualDose"
                type="number"
                min="0"
                value={formik.values.AnnualDose}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t("Enter Annual Dose")}
              />
            </div>
          </div>

          {/* Section: Stock */}
          <div className="form-section">
            <h2>{t("Stock Information")}</h2>

            <div className="input-group">
              <label htmlFor="bottles">{t("bottles")}</label>
              <input
                id="bottles"
                name="bottles"
                type="number"
                min="0"
                value={formik.values.bottles}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t("Enter Bottles Count")}
              />
            </div>

            <div className="input-group">
              <label htmlFor="dosesPerBottle">{t("dosesPerBottle")}</label>
              <input
                id="dosesPerBottle"
                name="dosesPerBottle"
                type="number"
                min="0"
                value={formik.values.dosesPerBottle}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t("Enter Doses Per Bottle")}
              />
            </div>

            <div className="input-group">
              <label htmlFor="bottlePrice">{t("bottlePrice")}</label>
              <input
                id="bottlePrice"
                name="bottlePrice"
                type="number"
                min="0"
                step="0.01"
                value={formik.values.bottlePrice}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t("Enter Bottle Price")}
              />
            </div>
          </div>

          {/* Section: Expiry */}
          <div className="form-section">
            <h2>{t("Expiry Information")}</h2>

            <div className="input-group">
              <label htmlFor="expiryDate">{t("expiryDate")}</label>
              <input
                id="expiryDate"
                name="expiryDate"
                type="date"
                value={formik.values.expiryDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button
            type="submit"
            className="save-button"
            disabled={isLoading || isBootstrapping}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <IoIosSave /> {t("Save")}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditVaccine;