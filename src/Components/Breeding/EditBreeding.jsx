import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../api/axios";
import { IoIosSave } from "react-icons/io";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import "./Breeding.css";

export default function EditBreeding() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // birthEntries تشمل plannedWeights للعرض فقط (read-only)
  const [birthEntries, setBirthEntries] = useState([
    {
      tagId: "",
      gender: "",
      birthWeight: "",
      ageAtWeaningDays: "",
      weightIntervalDays: "",
      plannedWeights: [],
    },
  ]);

  // تنسيق تاريخ للعرض
  const fmt = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  // تاريخ مناسب لـ <input type="date"> حسب التوقيت المحلي
  const asInputDate = (val) => {
    if (!val) return "";
    const d = new Date(val);
    const tzOffMin = d.getTimezoneOffset();
    const local = new Date(d.getTime() - tzOffMin * 60000);
    return local.toISOString().slice(0, 10);
  };

  // تطبيع الحَلَب عربي → إنجليزي للـ API
  const normalizeMilking = (val) => {
    const map = {
      "بدون لبن": "no milk",
      "واحد حلمة": "one teat",
      "اتنين حلمة": "two teat",
      "no milk": "no milk",
      "one teat": "one teat",
      "two teat": "two teat",
    };
    return map[val] || val;
  };

  // حساب فرق الأيام (لو السيرفر راجع expectedWeaningDate فقط)
  const diffDays = (d1, d2) => {
    try {
      const a = new Date(d1);
      const b = new Date(d2);
      const diff = Math.round((a - b) / (1000 * 60 * 60 * 24));
      return Number.isFinite(diff) && diff > 0 ? diff : "";
    } catch {
      return "";
    }
  };

  async function fetchBreedingData() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `/breeding/GetSingleBreeding/${id}`
      );

      const breeding = response.data?.data?.breeding;
      if (!breeding) throw new Error("Not found");

      // عدد المواليد
      const nb =
        typeof breeding.numberOfBirths === "number"
          ? breeding.numberOfBirths
          : Array.isArray(breeding.birthEntries)
          ? breeding.birthEntries.length
          : 1;

      // تاريخ الولادة لعنصر input
      const deliveryISO = breeding.deliveryDate
        ? asInputDate(breeding.deliveryDate)
        : "";

      formik.setValues({
        tagId: breeding.tagId || "",
        deliveryState: breeding.deliveryState || "",
        deliveryDate: deliveryISO,
        numberOfBirths: nb,
        milking: breeding.milking || "",
        motheringAbility: breeding.motheringAbility || "",
      });

      // دعم أسماء قديمة/بديلة + plannedWeights للعرض
      const mapped = (breeding.birthEntries || []).map((e) => {
        const birthWeight = e.birthWeight ?? e.birthweight ?? "";
        const ageAtWeaningDays =
          e.ageAtWeaningDays ??
          (e.expectedWeaningDate && breeding.deliveryDate
            ? diffDays(e.expectedWeaningDate, breeding.deliveryDate)
            : "");
        const weightIntervalDays = e.weightIntervalDays ?? "";
        const plannedWeights = Array.isArray(e.plannedWeights)
          ? e.plannedWeights
          : [];

        return {
          tagId: e.tagId || "",
          gender: e.gender || "",
          birthWeight: birthWeight === 0 ? 0 : birthWeight,
          ageAtWeaningDays,
          weightIntervalDays,
          plannedWeights, // read-only
        };
      });

      // لو المصفوفة أقل من nb كمّل بعناصر فاضية
      while (mapped.length < nb) {
        mapped.push({
          tagId: "",
          gender: "",
          birthWeight: "",
          ageAtWeaningDays: "",
          weightIntervalDays: "",
          plannedWeights: [],
        });
      }

      setBirthEntries(mapped.slice(0, nb));
    } catch (e) {
      setError(t("failed_to_fetch") || "Failed to fetch breeding data.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchBreedingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // تحقق محلي لحقول المواليد
  function validateBirthEntries() {
    const allowed = [7, 10, 14, 15, 30];
    for (let i = 0; i < birthEntries.length; i++) {
      const e = birthEntries[i];
      if (!e.tagId?.trim()) return `${t("calf_tag_required")} (#${i + 1})`;
      if (!e.gender) return `${t("gender_required")} (#${i + 1})`;

      const bw = Number(e.birthWeight);
      if (e.birthWeight === "" || Number.isNaN(bw) || bw < 0)
        return `${t("birth_weight_invalid")} (#${i + 1})`;

      const wean = Number(e.ageAtWeaningDays);
      if (
        e.ageAtWeaningDays === "" ||
        !Number.isInteger(wean) ||
        wean < 1 ||
        wean > 90
      )
        return `${t("age_at_weaning_invalid")} (#${i + 1})`;

      const interval = Number(e.weightIntervalDays);
      if (
        e.weightIntervalDays === "" ||
        !Number.isInteger(interval) ||
        !allowed.includes(interval)
      )
        return `${t("weight_interval_invalid")} (#${i + 1})`;
    }
    return null;
  }

  // PATCH
  const editBreeding = async (values) => {
    setIsLoading(true);
    setError(null);

    const beError = validateBirthEntries();
    if (beError) {
      setIsLoading(false);
      setError(beError);
      Swal.fire({
        title: t("error"),
        text: beError,
        icon: "error",
        confirmButtonText: t("ok"),
      });
      return;
    }

    try {
      const payload = {
        ...values,
        milking: normalizeMilking(values.milking),
        numberOfBirths: birthEntries.length,
        birthEntries: birthEntries.map((e) => ({
          tagId: e.tagId?.trim(),
          gender: e.gender,
          birthWeight: parseFloat(e.birthWeight),
          ageAtWeaningDays: parseInt(e.ageAtWeaningDays, 10),
          weightIntervalDays: parseInt(e.weightIntervalDays, 10),
          // plannedWeights لا تُرسل (read-only من السيرفر)
        })),
      };

      const { data } = await axiosInstance.patch(
        `/breeding/UpdateBreeding/${id}`,
        payload
      );

      if (data.status === "success") {
        Swal.fire({
          title: t("success"),
          text: t("breeding_updated_successfully"),
          icon: "success",
          confirmButtonText: t("ok"),
        }).then(() => navigate("/breadingTable"));
      } else {
        throw new Error(data?.message || "Unexpected response");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || t("error_occurred");
      setError(errorMessage);
      Swal.fire({
        title: t("error"),
        text: errorMessage,
        icon: "error",
        confirmButtonText: t("ok"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      tagId: "",
      deliveryState: "",
      deliveryDate: "",
      milking: "",
      motheringAbility: "",
      numberOfBirths: 1,
    },
    validationSchema: Yup.object({
      tagId: Yup.string().required(t("tag_id_required")),
      deliveryState: Yup.string()
        .required(t("delivery_state_required"))
        .oneOf(
          ["normal", "difficult", "assisted", "caesarean"],
          t("invalid_delivery_state")
        ),
      deliveryDate: Yup.date().required(t("delivery_date_required")),
      numberOfBirths: Yup.number()
        .required(t("number_of_births_required"))
        .min(1, t("min_births"))
        .max(4, t("max_births")),
      // milking/motheringAbility اختياريين هنا حسب الباك
    }),
    onSubmit: (values) => editBreeding(values),
  });

  function handleNumberOfBirthsChange(e) {
    const newNumber = Math.max(
      1,
      Math.min(4, parseInt(e.target.value, 10) || 1)
    );
    setBirthEntries((prev) => {
      const next = prev.slice(0, newNumber);
      while (next.length < newNumber) {
        next.push({
          tagId: "",
          gender: "",
          birthWeight: "",
          ageAtWeaningDays: "",
          weightIntervalDays: "",
          plannedWeights: [],
        });
      }
      return next;
    });
    formik.setFieldValue("numberOfBirths", newNumber);
  }

  function handleBirthEntriesChange(e, index) {
    const { name, value } = e.target;
    setBirthEntries((prev) => {
      const next = [...prev];
      next[index][name] = value;
      return next;
    });
  }

  return (
    <div className="breeding-details-container">
      <div className="breeding-details-header container">
        <h1>{t("edit_breeding")}</h1>
      </div>

      {isLoading && (
        <div className="loading-spinner" style={{ margin: "1.5rem auto" }} />
      )}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={formik.handleSubmit} className="breeding-form container">
        <div className="form-grid">
          <div className="form-section">
            <h2>{t("basic_info")}</h2>

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
              {formik.errors.tagId && formik.touched.tagId && (
                <p className="text-danger">{formik.errors.tagId}</p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="deliveryState">{t("delivery_state")}</label>
              <select
                id="deliveryState"
                name="deliveryState"
                value={formik.values.deliveryState}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">{t("select_delivery_state")}</option>
                <option value="normal">{t("normal")}</option>
                <option value="difficult">{t("difficult")}</option>
                <option value="assisted">{t("assisted")}</option>
                <option value="caesarean">{t("caesarean")}</option>
              </select>
              {formik.errors.deliveryState && formik.touched.deliveryState && (
                <p className="text-danger">{formik.errors.deliveryState}</p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="deliveryDate">{t("delivery_date")}</label>
              <input
                type="date"
                id="deliveryDate"
                name="deliveryDate"
                value={formik.values.deliveryDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.deliveryDate && formik.touched.deliveryDate && (
                <p className="text-danger">{formik.errors.deliveryDate}</p>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2>{t("breeding_details")}</h2>

            <div className="input-group">
              <label htmlFor="milking">{t("milking")}</label>
              <select
                id="milking"
                name="milking"
                value={formik.values.milking}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">{t("select_milking")}</option>
                <option value="no milk">{t("no_milk")}</option>
                <option value="one teat">{t("one_teat")}</option>
                <option value="two teat">{t("two_teat")}</option>
                {/* السماح بالعربي */}
                <option value="بدون لبن">{t("no_milk")}</option>
                <option value="واحد حلمة">{t("one_teat")}</option>
                <option value="اتنين حلمة">{t("two_teat")}</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="motheringAbility">{t("mothering_ability")}</label>
              <select
                id="motheringAbility"
                name="motheringAbility"
                value={formik.values.motheringAbility}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">{t("select")}</option>
                <option value="good">{t("good")}</option>
                <option value="medium">{t("medium")}</option>
                <option value="bad">{t("bad")}</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="numberOfBirths">{t("number_of_births")}</label>
              <input
                type="number"
                id="numberOfBirths"
                name="numberOfBirths"
                value={formik.values.numberOfBirths}
                onChange={handleNumberOfBirthsChange}
                min="1"
                max="4"
              />
              {formik.errors.numberOfBirths &&
                formik.touched.numberOfBirths && (
                  <p className="text-danger">{formik.errors.numberOfBirths}</p>
                )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>{t("birth_entries")}</h2>

          {birthEntries.map((entry, index) => (
            <div key={index} className="birth-entry-card">
              <h3>
                {t("calf")} {index + 1}
              </h3>

              <div className="input-group">
                <label htmlFor={`tagId-${index}`}>{t("calf_tag_id")}</label>
                <input
                  type="text"
                  id={`tagId-${index}`}
                  name="tagId"
                  value={entry.tagId}
                  onChange={(e) => handleBirthEntriesChange(e, index)}
                  placeholder={t("enter_calf_tag_id")}
                />
              </div>

              <div className="input-group">
                <label htmlFor={`gender-${index}`}>{t("gender")}</label>
                <select
                  id={`gender-${index}`}
                  name="gender"
                  value={entry.gender}
                  onChange={(e) => handleBirthEntriesChange(e, index)}
                >
                  <option value="">{t("select")}</option>
                  <option value="male">{t("male")}</option>
                  <option value="female">{t("female")}</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor={`birthWeight-${index}`}>
                  {t("birth_weight")}
                </label>
                <input
                  type="number"
                  id={`birthWeight-${index}`}
                  name="birthWeight"
                  value={entry.birthWeight}
                  onChange={(e) => handleBirthEntriesChange(e, index)}
                  placeholder={t("enter_birth_weight")}
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="input-group">
                <label htmlFor={`ageAtWeaningDays-${index}`}>
                  {t("age_at_weaning_days")}
                </label>
                <input
                  type="number"
                  id={`ageAtWeaningDays-${index}`}
                  name="ageAtWeaningDays"
                  value={entry.ageAtWeaningDays}
                  onChange={(e) => handleBirthEntriesChange(e, index)}
                  min="1"
                  max="90"
                />
                <small className="text-muted">{t("max_weaning_90_days")}</small>
              </div>

              <div className="input-group">
                <label htmlFor={`weightIntervalDays-${index}`}>
                  {t("weight_interval_days")}
                </label>
                <select
                  id={`weightIntervalDays-${index}`}
                  name="weightIntervalDays"
                  value={entry.weightIntervalDays}
                  onChange={(e) => handleBirthEntriesChange(e, index)}
                >
                  <option value="">{t("select")}</option>
                  <option value={7}>7</option>
                  <option value={10}>10</option>
                  <option value={14}>14</option>
                  <option value={15}>15</option>
                  <option value={30}>30</option>
                </select>
              </div>
              {/* Planned Weights (read-only, styled) */}
              {Array.isArray(entry.plannedWeights) &&
                entry.plannedWeights.length > 0 && (
                  <div className="planned-weights">
                    <div className="pw-header">
                      <label className="pw-title">
                        {t("planned_weights") || "Planned weigh dates"}
                      </label>
                      <span className="pw-count">
                        {entry.plannedWeights.length}
                      </span>
                    </div>

                    <ul className="pw-chips">
                      {entry.plannedWeights.map((d, i2) => (
                        <li key={i2} className="pw-chip" title={`#${i2 + 1}`}>
                          <span className="pw-index">#{i2 + 1}</span>
                          <time dateTime={d}>{fmt(d)}</time>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          ))}
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
