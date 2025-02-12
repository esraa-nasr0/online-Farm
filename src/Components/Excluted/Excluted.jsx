import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { IoIosSave } from "react-icons/io";

function Excluted() {
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
                `https://farm-project-bbzj.onrender.com/api/excluded/addexcluded`,
                value,
                { headers }
            );
            console.log('Submitting form with values:', value);
            console.log('Headers:', headers);
            console.log('Response:', data);

            if (data.status === "success") {
                setisLoading(false);
                setMatingData(data.data.excluded
);  
                setShowAlert(true);  
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "An error occurred while processing your request";
            setError(errorMessage);
            console.log(err.response?.data);
        } finally {
            setisLoading(false);
        }
    }
    
    let formik = useFormik({
        initialValues: {
            tagId: '',
            Date: '',
            weight: '',
            excludedType: '',
            price: '',
        },
        onSubmit: submitMating
    });

    return (
        <>
            <div className="container">
                <div style={{marginTop:"140px" ,color:"#88522e" ,  fontSize: "28px", fontWeight:"bold"}}>Excluted</div>
                <p className="text-danger">{error}</p>
                
                {showAlert && matingData && matingData.expectedDeliveryDate && (
                    <div className="alert mt-5 p-4 alert-success">
                        Expected Delivery Date: {new Date(matingData.expectedDeliveryDate).toLocaleDateString()}
                    </div>
                )}
                
                <form onSubmit={formik.handleSubmit} className="mt-5">
                    {isLoading ? (
                        <button type="submit" className="btn button2" disabled>
                            <i className="fas fa-spinner fa-spin"></i>
                        </button>
                    ) : (
                        <button type="submit"      className=" btn-lg active button2 rounded" 
                        style={{ background: "#88522e", color: "white", borderColor: "#3a7d44" ,paddingLeft:"10px" ,paddingRight:"10px" ,paddingBottom:"5px" ,paddingTop:"5px" }}   >
                            <IoIosSave /> Save
                        </button>
                    )}

                    <div className="animaldata">
                 
                        <div className="input-box">
                            <label className="label" htmlFor="weight">Weight</label>
                            <input
                                value={formik.values.weight}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="input2"
                                name="weight"
                                id="weight"
                                placeholder="weight"
                            />
                            {formik.errors.weight && formik.touched.weight ? <p className="text-danger">{formik.errors.weight}</p> : ""}
                        </div>

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
                                name="tagId"
                            />
                            {formik.errors.tagId && formik.touched.tagId ? <p className="text-danger">{formik.errors.tagId}</p> : ""}
                        </div>

                        <div className="input-box">
                            <label className="label" htmlFor="Date">Date</label>
                            <input
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.Date}
                                id="Date"
                                type="date"
                                className="input2"
                                name="Date"
                            />
                            {formik.errors.Date && formik.touched.Date ? <p className="text-danger">{formik.errors.Date}</p> : ""}
                        </div>

                        <div className="input-box">
                            <label className="label" htmlFor="excludedType">Excluded Type</label>
                            <select
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.excludedType}
                                id="excludedType"
                                className="input2"
                                name="excludedType"
                            >
                                <option value="sale">Sale</option>
                                <option value="death">Death</option>
                                <option value="sweep">Sweep</option>
                            </select>
                            {formik.errors.excludedType && formik.touched.excludedType ? <p className="text-danger">{formik.errors.excludedType}</p> : ""}
                        </div>

                        {formik.values.excludedType === 'sale' && (
                            <div className="input-box">
                                <label className="label" htmlFor="price">Price</label>
                                <input
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.price}
                                    placeholder="Enter Price"
                                    id="price"
                                    type="text"
                                    className="input2"
                                    name="price"
                                />
                                {formik.errors.price && formik.touched.price ? <p className="text-danger">{formik.errors.price}</p> : ""}
                            </div>
                        )}

                    </div>
                </form>
            </div>
        </>
    );
}

export default Excluted;