import axios from "axios";
import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { IoIosSave } from "react-icons/io";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { TreatmentContext } from "../../Context/TreatmentContext";
import { LocationContext } from "../../Context/LocationContext";
import { useTranslation } from "react-i18next";

function EditTreatAnimal() {
  const { id } = useParams(); // Extract id from URL
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locationSheds, setLocationSheds] = useState([]);
  const [treatmentOptions, setTreatmentOptions] = useState([]);

  const { getTreatmentMenue } = useContext(TreatmentContext);
  const { LocationMenue } = useContext(LocationContext);
  const { t } = useTranslation();

  // Helper function to generate headers with the latest token
  const getHeaders = () => {
    const Authorization = localStorage.getItem("Authorization");
    if (!Authorization) return {};
    return {
      Authorization: Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`,
    };
  };

  // Fetch location sheds
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { data } = await LocationMenue();
        setLocationSheds(data?.status === "success" ? data.data.locationSheds || [] : []);
      } catch (err) {
        console.error("Error loading location sheds:", err);
        setError("Failed to load location sheds");
      }
    };

    fetchLocation();
  }, []);

  // Fetch treatment options
  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const { data } = await getTreatmentMenue();
        setTreatmentOptions(data?.status === "success" ? data.data || [] : []);
      } catch (err) {
        console.error("Error loading treatment data:", err);
        setError("Failed to load treatment data");
      }
    };

    fetchTreatments();
  }, []);

  // Format date from ISO to YYYY-MM-DD
  const formatDate = (isoString) => (isoString ? isoString.split("T")[0] : "");

  // Validation schema
  const validationSchema = Yup.object({
    tagId: Yup.string().required("Tag ID is required"),
    locationShed: Yup.string().required("Location Shed is required"),
    date: Yup.date().required("Date is required"),
    treatments: Yup.array()
      .of(
        Yup.object({
          treatmentId: Yup.string().required("Treatment ID is required"),
          volume: Yup.number()
            .required("Volume is required")
            .positive("Volume must be positive")
            .typeError("Volume must be a valid number"),
        })
      )
      .min(1, "At least one treatment must be selected"),
  });

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      tagId: "",
      locationShed: "",
      date: "",
      treatments: [{ treatmentId: "", volume: "" }],
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await axios.patch(
          `https://farm-project-bbzj.onrender.com/api/treatment/updatetreatmentforAnimals/${id}`,
          values,
          { headers: getHeaders() }
        );

        if (data.status === "success") {
          Swal.fire({
            title: "Success!",
            text: "Treatment updated successfully!",
            icon: "success",
            confirmButtonText: "OK",
          });
        }
      } catch (err) {
        console.error("Error updating treatment:", err);
        setError(err.response?.data?.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Fetch the treatment data
  useEffect(() => {
    const fetchTreatment = async () => {
      setError(null);
      try {
        const { data } = await axios.get(
          `https://farm-project-bbzj.onrender.com/api/treatment/getsingletreatmentforAnimals/${id}`,
          { headers: getHeaders() }
        );

        if (data?.data?.treatmentShed) {
          const treatment = data.data.treatmentShed;
          formik.setValues({
            tagId: treatment.tagId || "",
            locationShed: treatment.locationShed?._id || "", // Ensure correct value format
            date: formatDate(treatment.date) || "",
            treatments:
              treatment.treatments?.map((comp) => ({
                treatmentId: comp.treatmentId || "",
                volume: comp.volume || "",
              })) || [{ treatmentId: "", volume: "" }],
          });
        } else {
          throw new Error("Unexpected API response structure");
        }
      } catch (error) {
        console.error("Failed to fetch treatment data:", error);
        setError("Failed to fetch treatment details.");
      }
    };

    fetchTreatment();
  }, [id]);

  // Add new treatment row
  const addTreat = () => {
    formik.setFieldValue("treatments", [
      ...formik.values.treatments,
      { treatmentId: "", volume: "" },
    ]);
  };

  // Handle treatment change
  const handleTreatmentChange = (e, index) => {
    const { name, value } = e.target;
    const treatments = [...formik.values.treatments];
    treatments[index][name] = value;
    formik.setFieldValue("treatments", treatments);
  };

  return (
    <div className="container">
      <div className="title2">Edit Treatment</div>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={formik.handleSubmit} className="mt-5">
        <button type="submit" className="btn button2" disabled={isLoading}>
          {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <IoIosSave />} Save
        </button>

        <div className="animaldata">
          <div className="input-box">
            <label className="label" htmlFor="tagId">
              Tag ID
            </label>
            <input
              autoComplete="off"
              {...formik.getFieldProps("tagId")}
              id="tagId"
              type="text"
              className="input2"
            />
          </div>

          <div className="input-box">
            <label className="label" htmlFor="locationShed">{t("location_shed")}</label>
            <select {...formik.getFieldProps("locationShed")} id="locationShed" className="input2">
              <option value="">{t("select_location_shed")}</option>
              {locationSheds?.map((shed) => (
                <option key={shed._id} value={shed._id}>{shed.locationShedName}</option>
              ))}
            </select>
          </div>

          {formik.values.treatments.map((treatment, index) => (
  <div key={index} className="input-box">
    {/* Treatment Name Label and Dropdown */}
    <label className="label" htmlFor={`treatment-${index}`}>
      Treatment Name
    </label>
    <select
      id={`treatment-${index}`}
      name="treatmentId"
      className="input2"
      value={treatment.treatmentId}
      onChange={(e) => handleTreatmentChange(e, index)}
    >
      <option value="">Select Treatment</option>
      {treatmentOptions.map((option) => (
        <option key={option._id} value={option._id}>{option.name}</option>
      ))}
    </select>

    {/* Volume Label and Input */}
    <label className="label" htmlFor={`volume-${index}`}>
      Volume
    </label>
    <input
      type="number"
      id={`volume-${index}`}
      className="input2"
      name="volume"
      value={treatment.volume}
      onChange={(e) => handleTreatmentChange(e, index)}
    />
  </div>
))}

        </div>

        <button type="button" onClick={addTreat} className="btn button2"> + </button>
      </form>
    </div>
  );
}

export default EditTreatAnimal;
