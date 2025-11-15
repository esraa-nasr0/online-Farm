import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import { VaccineTypeContext } from "../../Context/VaccineTypeContext";
import "./AddVaccineType.css";

export default function AddVaccineType() {
  const { addVaccineType } = useContext(VaccineTypeContext);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function addVaccine(formdata) {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("englishName", formdata.englishName);
      formDataToSend.append("arabicName", formdata.arabicName);
      formDataToSend.append("englishDiseaseType", formdata.englishDiseaseType);
      formDataToSend.append("arabicDiseaseType", formdata.arabicDiseaseType);
      formDataToSend.append("image", formdata.image);

      let res = await addVaccineType(formDataToSend);
console.log(res.status);

      if (res?.status==="201") {
        setSuccessMsg("✅ Vaccine type added successfully!");
        formik.resetForm();
        setPreview(null);
      } else {
        setErrorMsg("❌ Failed to add vaccine type.");
      }
    } catch (err) {
      setErrorMsg("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      englishName: "",
      arabicName: "",
      arabicDiseaseType: "",
      englishDiseaseType: "",
      image: null,
    },
    onSubmit: addVaccine,
  });

  function handleImageChange(e) {
    const file = e.currentTarget.files[0];
    formik.setFieldValue("image", file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }

  return (
    <div className="form-container">
      <h2 className="form-title fw-bold">Add Vaccine Type</h2>

      <form onSubmit={formik.handleSubmit} className="form-content">
        <label htmlFor="englishName">English Name</label>
        <input
          type="text"
          id="englishName"
          name="englishName"
          value={formik.values.englishName}
          onChange={formik.handleChange}
          placeholder="Enter English name"
          required
        />

        <label htmlFor="arabicName">Arabic Name</label>
        <input
          type="text"
          id="arabicName"
          name="arabicName"
          value={formik.values.arabicName}
          onChange={formik.handleChange}
          placeholder="ادخل الاسم بالعربية"
          required
        />

        <label htmlFor="englishDiseaseType">English Disease Type</label>
        <input
          type="text"
          id="englishDiseaseType"
          name="englishDiseaseType"
          value={formik.values.englishDiseaseType}
          onChange={formik.handleChange}
          placeholder="Enter disease type (English)"
          required
        />

        <label htmlFor="arabicDiseaseType">Arabic Disease Type</label>
        <input
          type="text"
          id="arabicDiseaseType"
          name="arabicDiseaseType"
          value={formik.values.arabicDiseaseType}
          onChange={formik.handleChange}
          placeholder="ادخل نوع المرض بالعربية"
          required
        />

        <label htmlFor="image">Upload Image</label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          required
        />

        {preview && (
          <div className="image-preview">
            <p>Preview:</p>
            <img src={preview} alt="preview" />
          </div>
        )}

        {errorMsg && <p className="error-msg">{errorMsg}</p>}
        {successMsg && <p className="success-msg">{successMsg}</p>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Loading..." : "Add Vaccine"}
        </button>
      </form>
    </div>
  );
}
