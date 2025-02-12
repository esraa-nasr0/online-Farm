import axios from 'axios';
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { IoIosSave } from "react-icons/io";
import Swal from 'sweetalert2';



function Mating() {
    const [showAlert, setShowAlert] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const [matingData, setMatingData] = useState(null);


    let Authorization = localStorage.getItem('Authorization');
    let headers = {
        Authorization: `Bearer ${Authorization}`
    };

    async function submitMating(value) {
        setisLoading(true); 
        try {
            let { data } = await axios.post(
                `https://farm-project-bbzj.onrender.com/api/mating/addmating`,
                value,
                { headers }
            );console.log('Submitting form with values:', value);
            console.log('Headers:', headers);
            console.log('Response:', data);

            if (data.status === "success") {
                setisLoading(false);
                setMatingData(data.data.mating);  // Access the mating data correctly
                setShowAlert(true);  // Show the alert with the delivery date
                // Show SweetAlert success message
        Swal.fire({
            title: 'Success!',
            text: 'Mating data added successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
            });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "An error occurred while processing your request";
            setError(errorMessage);
            console.log(err.response?.data);
        }
        
    }
    

    let formik = useFormik({
        initialValues: {
            tagId: '',
            matingType: '',
            maleTag_id: '',
            matingDate: '',
            sonarDate: '',
            sonarRsult: '',
        },
        onSubmit: submitMating
    });

    return (
        <>
            <div className="container">
                <div className="title2">Mating</div>
                <p className="text-danger">{error}</p>
                
                {/* Expected Delivery Date Alert */}
                {showAlert && matingData && matingData.expectedDeliveryDate && (
    <div className="alert mt-5 p-4  alert-success">
        Expected Delivery Date: {new Date(matingData.expectedDeliveryDate).toLocaleDateString()}
    </div>
)}
                <form onSubmit={formik.handleSubmit} className="mt-5">

                    {isLoading ? (
                        <button type="submit" className="btn  button2" disabled>
                        <i className="fas fa-spinner fa-spin"></i>
                        </button>
                    ) : (
                        <button type="submit" className="btn  button2">
                            <IoIosSave /> Save
                        </button>
                    )}

    <div className="animaldata">

    <div className="input-box">
        <label className="label" htmlFor="tagId">Tag ID</label>
        <input
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.tagId}
            placeholder="Enter your Tag ID"
            id="tagId"
            type="text"
            className="input2"
            name="tagId"/>
            {formik.errors.tagId && formik.touched.tagId ? <p className="text-danger">{formik.errors.tagId}</p> : ""}
                        </div>

                        {/* Mating Type */}
                        <div className="input-box">
                            <label className="label" htmlFor="matingType">Mating Type</label>
                            <select
                                value={formik.values.matingType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="input2"
                                name="matingType"
                                id="matingType"
                            >
                                <option value="" >Mating Type</option>
                                <option value="Natural">Natural</option>
                            </select>
                            {formik.errors.matingType && formik.touched.matingType ? <p className="text-danger">{formik.errors.matingType}</p> : ""}
                        </div>

                        {/* Male Tag ID */}
                        <div className="input-box">
                            <label className="label" htmlFor="maleTag_id">Male Tag ID</label>
                            <input
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.maleTag_id}
                                placeholder="Enter your Male Tag ID"
                                id="maleTag_id"
                                type="text"
                                className="input2"
                                name="maleTag_id"
                            />
                            {formik.errors.maleTag_id && formik.touched.maleTag_id ? <p className="text-danger">{formik.errors.maleTag_id}</p> : ""}
                        </div>

        <div className="input-box">
        <label className="label" htmlFor="matingDate">Mating Date</label>
            <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.matingDate}  id="matingDate" type="date" className="input2" name="matingDate"/>
            {formik.errors.matingDate && formik.touched.matingDate?<p className="text-danger">{formik.errors.matingDate}</p>:""}
        </div>

        <div className="input-box">
        <label className="label" htmlFor="sonarDate">Sonar Date</label>
            <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.sonarDate}  id="sonarDate" type="date" className="input2" name="sonarDate"/>
            {formik.errors.sonarDate && formik.touched.sonarDate?<p className="text-danger">{formik.errors.sonarDate}</p>:""}
        </div>


                        {/* Sonar Result */}
                        <div className="input-box">
                            <label className="label" htmlFor="sonarRsult">Sonar Result</label>
                            <select
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.sonarRsult}
                                id="sonarRsult"
                                className="input2"
                                name="sonarRsult"
                            >
                                <option value="" disabled>Select Sonar Result</option>
                                <option value="positive">Positive</option>
                                <option value="negative">Negative</option>
                            </select>
                            {formik.errors.sonarRsult && formik.touched.sonarRsult ? (
                                <p className="text-danger">{formik.errors.sonarRsult}</p>
                            ) : ""}
                        </div>

                    </div>
                </form>


            </div>
        </>
    );
}

export default Mating;
