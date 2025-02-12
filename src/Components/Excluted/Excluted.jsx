import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { IoIosSave } from "react-icons/io";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
function Excluted() {
     const navigate = useNavigate();
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
                Swal.fire({
                    title: "Success!",
                    text: "Data has been submitted successfully!",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then(() => navigate('/exclutedtable'));
            }
        } catch (err) {
            Swal.fire({
                title: "Error!",
                text: err.response?.data?.message || "An error occurred while submitting data.",
                icon: "error",
                confirmButtonText: "OK",
            });
        
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
            reasoneOfDeath: ''
            
        },
        onSubmit: submitMating
    });

    return (
        <>
            <div className="container">
       
                <p className="text-danger">{error}</p>
                
                {showAlert && matingData && matingData.expectedDeliveryDate && (
                    <div className="alert mt-5 p-4 alert-success">
                        Expected Delivery Date: {new Date(matingData.expectedDeliveryDate).toLocaleDateString()}
                    </div>
                )}
                
                <form onSubmit={formik.handleSubmit} className="mt-5">
                            
                              {isLoading ? (
                                  
                                  <div className=' d-flex vaccine align-items-center justify-content-between'>
                                  <div className="title-v">Add Excluted</div>
                                
                                  <button type="submit" className="btn button2">
                                              <i className="fas fa-spinner fa-spin"></i>
                                          </button>
                  
                                  </div>
                                  
                                      ) : (
                                                 <div className=' d-flex vaccine align-items-center justify-content-between'>
                                                        <div className="title-v">Add Excluted</div>
                                                        <button type="submit" className="btn  button2" disabled={isLoading}>
                                                            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <IoIosSave />} Save
                                                        </button>
                                        
                                                        </div>
                                                
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
    <option value="" disabled hidden> Choose excluded Type  </option>
    <option value="sale">Sale</option>
    <option value="death">Death</option>
    <option value="sweep">Sweep</option>
</select>

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

{formik.values.excludedType === 'death' && (
   <div className="input-box">
   <label className="label" htmlFor="reasoneOfDeath">reasoneOfDeath</label>
   <input
       onBlur={formik.handleBlur}
       onChange={formik.handleChange}
       value={formik.values.reasoneOfDeath}
       id="reasoneOfDeath"
       type="text"
       className="input2  "
       name="reasoneOfDeath"
   />
   {formik.errors.Date && formik.touched.Date ? <p className="text-danger">{formik.errors.Date}</p> : ""}
</div>
)}
{formik.values.excludedType === 'sweep' && (
   <div className="input-box">
   <label className="label" htmlFor="reasoneOfDeath">reasoneOfsweep</label>
   <input
       onBlur={formik.handleBlur}
       onChange={formik.handleChange}
       value={formik.values.reasoneOfDeath}
       id="reasoneOfDeath"
       type="text"
       className="input2  "
       name="reasoneOfDeath"
   />
   {formik.errors.Date && formik.touched.Date ? <p className="text-danger">{formik.errors.Date}</p> : ""}
</div>
)}
                           
                            {formik.errors.excludedType && formik.touched.excludedType ? <p className="text-danger">{formik.errors.excludedType}</p> : ""}
                        </div>
                     
                
                    </div>
                </form>
            </div>
        </>
    );
}

export default Excluted;



