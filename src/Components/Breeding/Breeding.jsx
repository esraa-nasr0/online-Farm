import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../api/axios";
import { IoIosSave } from "react-icons/io";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../Animals/AnimalsDetails.css";

export default function Breeding() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // === State ===
  const [numberOfBirths, setNumberOfBirths] = useState(1);
  const [birthEntries, setBirthEntries] = useState([
    { tagId: "", gender: "", birthWeight: "", ageAtWeaningDays: "", weightIntervalDays: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // ✅ يمسك نتيجة الحفظ لعرض plannedWeights
  const [savedBreeding, setSavedBreeding] = useState(null);


  // === helpers ===
  const fmt = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  // نجيب plannedWeights للعرض: بالأولوية على tagId، ولو فاضي نطابق بالترتيب
  const getPlannedByEntry = (index, entry) => {
    const list = savedBreeding?.birthEntries || [];
    if (!Array.isArray(list) || list.length === 0) return [];
    if (entry?.tagId) {
      const byTag = list.find((be) => be?.tagId === entry.tagId);
      if (byTag?.plannedWeights?.length) return byTag.plannedWeights;
    }
    return list[index]?.plannedWeights || [];
  };

  // === Validation (بدون ديفولتات، لكن مطلوب إدخال القيم) ===
  const validationSchema = Yup.object({
    tagId: Yup.string().required(t("tag_id_required")),
    deliveryState: Yup.string()
      .oneOf(["normal", "difficult", "assisted", "caesarean"])
      .required(t("delivery_state_required")),
    deliveryDate: Yup.date().required(t("delivery_date_required")),
    numberOfBirths: Yup.number().required(t("number_of_births_required")).min(1, t("min_births")).max(4, t("max_births")),
    milking: Yup.string()
      .oneOf(["no milk", "one teat", "two teat", "بدون لبن", "واحد حلمة", "اتنين حلمة"])
      .required(t("milking_required")),
    motheringAbility: Yup.string().oneOf(["good", "medium", "bad"]).required(t("mothering_ability_required")),
  });

  const formik = useFormik({
    initialValues: {
      tagId: "",
      deliveryState: "",
      deliveryDate: "",
      numberOfBirths: 1,
      milking: "",
      motheringAbility: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  // === Local validation for birthEntries (كلها مطلوبة) ===
  function validateBirthEntries() {
    if (birthEntries.length !== numberOfBirths) {
      return t("birth_entries_count_mismatch");
    }
    for (let i = 0; i < birthEntries.length; i++) {
      const e = birthEntries[i];

      if (!e.tagId?.trim()) return `${t("calf_tag_required")} (#${i + 1})`;
      if (!e.gender) return `${t("gender_required")} (#${i + 1})`;

      const bw = Number(e.birthWeight);
      if (e.birthWeight === "" || Number.isNaN(bw) || bw < 0) {
        return `${t("birth_weight_invalid")} (#${i + 1})`;
      }

      const wean = Number(e.ageAtWeaningDays);
      if (e.ageAtWeaningDays === "" || !Number.isInteger(wean) || wean < 1) {
        return `${t("age_at_weaning_invalid")} (#${i + 1})`;
      }

      const interval = Number(e.weightIntervalDays);
      if (e.weightIntervalDays === "" || !Number.isInteger(interval) || interval < 1) {
        return `${t("weight_interval_invalid")} (#${i + 1})`;
      }
    }
    return null;
  }

  // تطبيع milking عربي → إنجليزي
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

  async function handleSubmit(values) {
    setIsLoading(true);
    setError(null);

    const beError = validateBirthEntries();
    if (beError) {
      setIsLoading(false);
      setError(beError);
      Swal.fire({ title: t("error"), text: beError, icon: "error", confirmButtonText: t("ok") });
      return;
    }

    try {
      const dataToSubmit = {
        ...values,
        milking: normalizeMilking(values.milking),
        numberOfBirths: birthEntries.length,
        birthEntries: birthEntries.map((entry) => ({
          tagId: entry.tagId?.trim(),
          gender: entry.gender,
          birthWeight: parseFloat(entry.birthWeight),
          ageAtWeaningDays: parseInt(entry.ageAtWeaningDays, 10),
          weightIntervalDays: parseInt(entry.weightIntervalDays, 10),
        })),
      };

      const { data } = await axiosInstance.post(
        `/breeding/AddBreeding`,
        dataToSubmit
      );

      if (data.status === "success") {
        // ✅ خزّن الاستجابة لعرض plannedWeights تحت كل مولود
        setSavedBreeding(data?.data?.breeding || null);

        setIsSubmitted(true);
        Swal.fire({
          title: t("success"),
          text: t("breeding_added_successfully"),
          icon: "success",
          confirmButtonText: t("ok"),
        });
      } else {
        throw new Error(data?.message || "Unexpected response");
      }
    } catch (err) {
      const msg = err.response?.data?.message || t("error_occurred");
      setError(msg);
      Swal.fire({ title: t("error"), text: msg, icon: "error", confirmButtonText: t("ok") });
    } finally {
      setIsLoading(false);
    }
  }

  // === Handlers ===
  function handleNumberOfBirthsChange(e) {
    const newNumber = Math.max(1, Math.min(4, parseInt(e.target.value, 10) || 1));
    setNumberOfBirths(newNumber);
    setBirthEntries((prev) => {
      const next = prev.slice(0, newNumber);
      while (next.length < newNumber) {
        next.push({ tagId: "", gender: "", birthWeight: "", ageAtWeaningDays: "", weightIntervalDays: "" });
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
    <div className="animal-details-container">
      <div className="animal-details-header container">
        <h1>{t("breeding")}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={formik.handleSubmit} className="animal-form container">
        <div className="form-grid">
          {/* Section 1 */}
          <div className="form-section">
            <h2>{t("basic_info")}</h2>

            <div className="input-group">
              <label htmlFor="tagId">{t("mother_id")}</label>
              <input
                type="text"
                id="tagId"
                name="tagId"
                value={formik.values.tagId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t("enter_tag_id")}
              />
              {formik.errors.tagId && formik.touched.tagId && <p className="text-danger">{formik.errors.tagId}</p>}
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

          {/* Section 2 */}
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
                
              </select>
              {formik.errors.milking && formik.touched.milking && <p className="text-danger">{formik.errors.milking}</p>}
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
              {formik.errors.motheringAbility && formik.touched.motheringAbility && (
                <p className="text-danger">{formik.errors.motheringAbility}</p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="numberOfBirths">{t("number_of_births")}</label>
              <input
                type="number"
                id="numberOfBirths"
                name="numberOfBirths"
                value={numberOfBirths}
                onChange={handleNumberOfBirthsChange}
                min="1"
                max="4"
              />
              {formik.errors.numberOfBirths && formik.touched.numberOfBirths && (
                <p className="text-danger">{formik.errors.numberOfBirths}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3 - Birth entries */}
        <div className="form-section">
          <h2>{t("birth_entries")}</h2>

          {birthEntries.map((entry, index) => {
            const planned = getPlannedByEntry(index, entry);
            return (
              <div key={index} className="birth-entry-card">
                <h3>{t("calf")} {index + 1}</h3>

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
                  <label htmlFor={`birthWeight-${index}`}>{t("birth_weight")}</label>
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
                  <label htmlFor={`ageAtWeaningDays-${index}`}>{t("age_at_weaning_days")}</label>
                  <input
                    type="number"
                    id={`ageAtWeaningDays-${index}`}
                    name="ageAtWeaningDays"
                    value={entry.ageAtWeaningDays}
                    onChange={(e) => handleBirthEntriesChange(e, index)}
                    min="1"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor={`weightIntervalDays-${index}`}>{t("weight_interval_days")}</label>
                  <input
                    type="number"
                    id={`weightIntervalDays-${index}`}
                    name="weightIntervalDays"
                    value={entry.weightIntervalDays}
                    onChange={(e) => handleBirthEntriesChange(e, index)}
                    min="1"
                  />
                </div>

                {/* Planned Weights (read-only, styled) – تظهر بعد الحفظ */}
                {isSubmitted && Array.isArray(planned) && planned.length > 0 && (
                  <div className="planned-weights">
                    <div className="pw-header">
                      <label className="pw-title">
                        {t('planned_weights') || 'Planned weigh dates'}
                      </label>
                      <span className="pw-count">{planned.length}</span>
                    </div>

                    <ul className="pw-chips">
                      {planned.map((d, i2) => (
                        <li key={i2} className="pw-chip" title={`#${i2 + 1}`}>
                          <span className="pw-index">#{i2 + 1}</span>
                          <time dateTime={d}>{fmt(d)}</time>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button type="submit" className="save-button" disabled={isLoading}>
            {isLoading ? <span className="loading-spinner"></span> : (<><IoIosSave /> {t("save")}</>)}
          </button>

          {isSubmitted && (
            <button
              type="button"
              className="save-button reset-button"
              onClick={() => {
                formik.resetForm();
                setNumberOfBirths(1);
                setBirthEntries([{ tagId: "", gender: "", birthWeight: "", ageAtWeaningDays: "", weightIntervalDays: "" }]);
                setIsSubmitted(false);
                setSavedBreeding(null);
              }}
            >
              {t("add_new_breeding")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}