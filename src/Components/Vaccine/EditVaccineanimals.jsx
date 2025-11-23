import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { IoIosSave } from "react-icons/io";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { LocationContext } from '../../Context/Locationshedcontext';
import { useTranslation } from 'react-i18next';
import '../Animals/AnimalsDetails.css'; // ✅ ضفنا الاستيراد ده علشان ياخد نفس الستايل

function EditVaccine() {
  const { t, i18n } = useTranslation();
  const { getVaccineMenue } = useContext(LocationContext);
  const [vaccines, setVaccines] = useState([]);
  const [isLoadingVaccines, setIsLoadingVaccines] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const getHeaders = () => {
    const token = localStorage.getItem('Authorization');
    return {
      'Authorization': token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  useEffect(() => {
    const fetchVaccines = async () => {
      setIsLoadingVaccines(true);
      try {
        const { data } = await getVaccineMenue();
        if (data.status === 'success') {
          setVaccines(data.data.vaccines || []);
        }
      } catch (err) {
        console.error("Error fetching vaccines:", err);
        setVaccines([]);
        setError(t("failed_to_load_vaccines"));
      } finally {
        setIsLoadingVaccines(false);
      }
    };
    fetchVaccines();
  }, [getVaccineMenue]);

  async function editVaccine(values) {
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `https://api.mazraaonline.com/api/vaccine/updateVaccineEntry/${id}`,
        {
          tagId: values.tagId,
          date: values.date,
          entryType: values.entryType,
          vaccineId: values.vaccineId
        },
        { headers: getHeaders() }
      );

      if (response.data.status === "success") {
        Swal.fire({
          title: t('success'),
          text: t('vaccine_updated_successfully'),
          icon: 'success',
          confirmButtonColor: '#9cbd81'
        });
        navigate('/vaccineTable');
      }
    } catch (err) {
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.message || t('error_updating_vaccine'));
      Swal.fire({
        title: t('error'),
        text: err.response?.data?.message || t('error_updating_vaccine'),
        icon: 'error',
        confirmButtonColor: '#9cbd81'
      });
    } finally {
      setIsLoading(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      tagId: '',
      date: '',
      entryType: '',
      vaccineId: ''
    },
    onSubmit: editVaccine,
  });

  useEffect(() => {
    async function fetchVaccineEntry() {
      try {
        const response = await axios.get(
          `https://api.mazraaonline.com/api/vaccine/getSingleVaccineEntry/${id}`,
          { headers: getHeaders() }
        );

        const vaccineEntry = response.data.data.vaccineEntry;
        const formattedDate = vaccineEntry.date
          ? new Date(vaccineEntry.date).toISOString().split('T')[0]
          : '';

        const vaccineId = vaccineEntry.vaccineId ||
          (vaccineEntry.vaccine ? vaccineEntry.vaccine._id : '');

        formik.setValues({
          tagId: vaccineEntry.tagId || '',
          vaccineId: vaccineId,
          date: formattedDate,
          entryType: vaccineEntry.entryType || ''
        });
      } catch (error) {
        console.error("Error fetching vaccine entry:", error.response?.data);
        setError(t("error_fetching_vaccine_details"));
      }
    }
    fetchVaccineEntry();
  }, [id]);

  return (
    <div className="animal-details-container">
      <div className="animal-details-header container">
        <h1>{t("edit_vaccine")}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={formik.handleSubmit} className="animal-form container">
        <div className="form-grid">
          <div className="form-section">
            <h2>{t("animal_information")}</h2>

            <div className="input-group">
              <label htmlFor="tagId">{t("animal_tag_id")}</label>
              {/* ✅ شيلنا form-control علشان ما يكسرش ستايل الصفحة */}
              <input
                id="tagId"
                name="tagId"
                type="text"
                placeholder={t("enter_animal_tag_id")}
                value={formik.values.tagId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2>{t("vaccine_details")}</h2>

            <div className="input-group">
              <label htmlFor="vaccineId">{t("vaccine")}</label>
              <select
                id="vaccineId"
                name="vaccineId"
                value={formik.values.vaccineId}
                onChange={formik.handleChange}
                required
                disabled={isLoadingVaccines}
              >
                <option value="">{t("select_vaccine")}</option>
                {isLoadingVaccines ? (
                  <option disabled>{t("loading_vaccines")}</option>
                ) : (
                  vaccines.map((vaccine) => {
                    let vaccineName = "";
                    if (vaccine.vaccineType) {
                      vaccineName = i18n.language === "ar"
                        ? vaccine.vaccineType.arabicName
                        : vaccine.vaccineType.englishName;
                    } else if (vaccine.otherVaccineName) {
                      vaccineName = vaccine.otherVaccineName;
                    } else {
                      vaccineName = t("unknown_vaccine");
                    }

                    return (
                      <option key={vaccine._id} value={vaccine._id}>
                        {vaccineName}
                      </option>
                    );
                  })
                )}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="entryType">{t("entry_type")}</label>
              <select
                id="entryType"
                name="entryType"
                value={formik.values.entryType}
                onChange={formik.handleChange}
                required
              >
                <option value="">{t("select_entry_type")}</option>
                <option value="Booster Dose">{t("booster_dose")}</option>
                <option value="Annual Dose">{t("annual_dose")}</option>
                <option value="Initial Dose">{t("initial_dose")}</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h2>{t("date_information")}</h2>

            <div className="input-group">
              <label htmlFor="date">{t("vaccination_date")}</label>
              <input
                id="date"
                name="date"
                type="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="save-button"
            disabled={isLoading || isLoadingVaccines}
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

export default EditVaccine;