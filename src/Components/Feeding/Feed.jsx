import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";
import { IoIosSave } from "react-icons/io";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

export default function Feed() {
    const [isLoading, setIsLoading] = useState(false);
    const { Authorization } = useContext(UserContext);
       const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate()
    async function handleSubmit(values) {
        try {
            setIsLoading(true);
            const dataToSubmit = {
                ...values,
            };

            console.log("Authorization:", Authorization);
            console.log("Submitting form with values:", dataToSubmit);

            const { data } = await axios.post(
                "https://farm-project-bbzj.onrender.com/api/feed/addfeed",
                dataToSubmit,
                {
                    headers: {
                        Authorization: `Bearer ${Authorization}`,
                    },
                }
            );

            console.log("Response:", data);

            if (data.status === "success") {
                setIsLoading(false);
              
                setShowAlert(true); 
        if (data.status === "success") {
                      Swal.fire({
                          title: "Success!",
                          text: "Data has been submitted successfully!",
                          icon: "success",
                          confirmButtonText: "OK",
                      }).then(() => navigate('/feedingTable'));
                  }}
              } catch (err) {
                  Swal.fire({
                      title: "Error!",
                      text: err.response?.data?.message || "An error occurred while submitting data.",
                      icon: "error",
                      confirmButtonText: "OK",
                  });
              
              } finally {
                  setIsLoading(false);
              }
    }

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        type: Yup.string().required("Type is required"),
        price: Yup.number().required("Price is required"),
        concentrationOfDryMatter: Yup.number().required("Concentration of Dry Matter is required"),
        quantity: Yup.number().required("quantity is required"),

    });

    const formik = useFormik({
        initialValues: {
            name: "",
            type: "",
            price: "",
            concentrationOfDryMatter: "",
            quantity: "",
        },
        validationSchema,
        onSubmit: handleSubmit,
    });

    return (
        <div className="container">
      
            <form onSubmit={formik.handleSubmit} className="mt-5">
                {isLoading ? (
                      <div className="d-flex vaccine align-items-center justify-content-between">
                      <div className="title-v">Add Feed</div>
                      <button type="submit" className="btn button2" disabled={isLoading}>
                          {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <IoIosSave />} Save
                      </button>
                  </div>
                ) : (
                    
                    <div className="d-flex vaccine align-items-center justify-content-between">
                                      <div className="title-v">Add Feed</div>
                                      <button type="submit" className="btn button2" disabled={isLoading}>
                                          {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <IoIosSave />} Save
                                      </button>
                                  </div>
                  
                )}
                <div className="animaldata">
                    <div className="input-box">
                        <label className="label" htmlFor="name">
                            Name
                        </label>
                        <input
                            {...formik.getFieldProps("name")}
                            placeholder="Enter feed name"
                            id="name"
                            type="text"
                            className="input2"
                        />
                        {formik.touched.name && formik.errors.name && (
                            <p className="text-danger">{formik.errors.name}</p>
                        )}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="type">
                            Type
                        </label>
                        <input
                            {...formik.getFieldProps("type")}
                            placeholder="Enter feed type"
                            id="type"
                            type="text"
                            className="input2"
                        />
                        {formik.touched.type && formik.errors.type && (
                            <p className="text-danger">{formik.errors.type}</p>
                        )}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="price">
                            Price
                        </label>
                        <input
                            {...formik.getFieldProps("price")}
                            placeholder="Enter price"
                            id="price"
                            type="text"
                            className="input2"
                        />
                        {formik.touched.price && formik.errors.price && (
                            <p className="text-danger">{formik.errors.price}</p>
                        )}
                    </div>

                    <div className="input-box">
                        <label className="label" htmlFor="concentrationOfDryMatter">
                            Concentration of Dry Matter
                        </label>
                        <input
                            {...formik.getFieldProps("concentrationOfDryMatter")}
                            placeholder="Enter concentration of dry matter"
                            id="concentrationOfDryMatter"
                            type="text"
                            className="input2"
                        />
                        {formik.touched.concentrationOfDryMatter && formik.errors.concentrationOfDryMatter && (
                            <p className="text-danger">{formik.errors.concentrationOfDryMatter}</p>
                        )}
                    </div>
                    
                    <div className="input-box">
                        <label className="label" htmlFor="quantity">
                        Quantity
                        </label>
                        <input
                            {...formik.getFieldProps("quantity")}
                            placeholder="Enter Quantity"
                            id="quantity"
                            type="text"
                            className="input2"
                        />
                        {formik.touched.quantity && formik.errors.quantity && (
                            <p className="text-danger">{formik.errors.quantity}</p>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}
