import axios from "axios";
import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { IoIosSave } from "react-icons/io";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { TreatmentContext } from "../../Context/TreatmentContext";

function EditTreatAnimal() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const { getTreatmentMenue } = useContext(TreatmentContext);
  const [treatmentData, setTreatmentData] = useState([]);

  const Authorization = localStorage.getItem("Authorization");
  const headers = { Authorization: `Bearer ${Authorization}` };

  // Fetch treatment menu options
  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const { data } = await getTreatmentMenue();
        if (data.status === "success" && Array.isArray(data.data)) {
          setTreatmentData(data.data);
        } else {
          setTreatmentData([]);
        }
      } catch (err) {
        setError("Failed to load treatment data");
        setTreatmentData([]);
      }
    };
    fetchTreatments();
  }, [getTreatmentMenue]);

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
          { headers }
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
          { headers }
        );

        if (data?.data?.treatmentShed) {
          const treatment = data.data.treatmentShed;
          formik.setValues({
            tagId: treatment.tagId || "",
            locationShed: treatment.locationShed || "",
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
        {isLoading ? (
          <button type="submit" className="btn button2" disabled>
            <i className="fas fa-spinner fa-spin"></i>
          </button>
        ) : (
          <button type="submit" className="btn button2">
            <IoIosSave /> Save
          </button>
        )}

        <div className="animaldata">
          <div className="input-box">
            <label className="label" htmlFor="tagId">
              Tag ID
            </label>
            <input
              autoComplete="off"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.tagId}
              id="tagId"
              type="text"
              className="input2"
              name="tagId"
              aria-label="Tag ID"
            />
          </div>

          <div className="input-box">
            <label className="label" htmlFor="locationShed">
              Location Shed
            </label>
            <input
              autoComplete="off"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.locationShed}
              id="locationShed"
              type="text"
              className="input2"
              name="locationShed"
              aria-label="Location Shed"
            />
          </div>

          <div className="input-box">
            <label className="label" htmlFor="date">
              Date
            </label>
            <input
              autoComplete="off"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.date}
              id="date"
              type="date"
              className="input2"
              name="date"
              aria-label="Date of Treatment"
            />
          </div>

          {formik.values.treatments.map((treatment, index) => (
            <div key={index} className="input-box">
              <label className="label" htmlFor={`treatmentId-${index}`}>
                Treatment Name
              </label>
              <select
                id={`treatmentId-${index}`}
                name="treatmentId"
                className="input2"
                value={treatment.treatmentId}
                onChange={(e) => handleTreatmentChange(e, index)}
                onBlur={formik.handleBlur}
                aria-label="Treatment Name"
              >
                <option value="">Select Treatment</option>
                {treatmentData.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.name}
                  </option>
                ))}
              </select>

              <label className="label" htmlFor={`volume-${index}`}>
                Volume
              </label>
              <input
                autoComplete="off"
                onBlur={formik.handleBlur}
                onChange={(e) => handleTreatmentChange(e, index)}
                value={treatment.volume}
                id={`volume-${index}`}
                type="number"
                className="input2"
                name="volume"
                aria-label="Treatment Volume"
            />
            </div>
          ))}
        </div>
        
        <button type="button" onClick={addTreat} className="btn button2">
            + 
        </button>
      </form>
    </div>
  );
}

export default EditTreatAnimal;
