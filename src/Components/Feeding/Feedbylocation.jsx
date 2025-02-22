import React, { useContext, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { IoIosSave } from 'react-icons/io';
import axios from 'axios';
import { Feedcontext } from '../../Context/FeedContext';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

export default function Feedbylocation() {
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feeds, setFeeds] = useState([]);
  const { getFodderMenue } = useContext(Feedcontext);
  const navigate = useNavigate()

  
// Helper function to generate headers with the latest token
const getHeaders = () => {
  const Authorization = localStorage.getItem('Authorization');

  // Ensure the token has only one "Bearer" prefix
  const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;

  return {
      Authorization: formattedToken
  };
};

  const fetchFeeds = async () => {
    try {
      const { data } = await getFodderMenue();
      if (data.status === 'success') {
        setFeeds(data.data);
      }
    } catch (err) {
      setError('Failed to load Feed data');
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, [getFodderMenue]);

  async function post(values) {
    const headers = getHeaders(); // Get the latest headers

    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.post(
        "https://farm-project-bbzj.onrender.com/api/feed/addfeedbylocationshed", 
        values,
        {
          headers
        }
      );
      console.log(response.data);
      if (response.data.status === "SUCCESS") {
        Swal.fire({
          title: "Success!",
          text: `Data has been submitted successfully!\nTotal Feed Cost: ${response.data.totalFeedCost}\nPer Animal Feed Cost: ${response.data.perAnimalFeedCost}`,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => navigate('/feedlocationtable'));
      }
      
      }  catch (err) {
                      
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

  const formik = useFormik({
    initialValues: {
      locationShed: "",
      feeds: [
        { feedId: "", quantity: "" }  
      ],
      date: ""
    },
    onSubmit: (values) => {
      post(values);
    },
   
    validate: (values) => {
      const errors = {};
      if (!values.locationShed) {
        errors.locationShed = 'Location Shed is required';
      }
      if (!values.date) {
        errors.date = 'Date is required';
      }
     
      values.feeds.forEach((feed, index) => {
        if (!feed.feedId) {
          if (!errors.feeds) errors.feeds = [];
          errors.feeds[index] = { feedId: 'Feed is required' };
        }
        if (!feed.quantity) {
          if (!errors.feeds) errors.feeds = [];
          if (!errors.feeds[index]) errors.feeds[index] = {};
          errors.feeds[index].quantity = 'Quantity is required';
        }
      });
      return errors;
    }
  });

  const handleFeedChange = (index, field, value) => {
    const newFeeds = [...formik.values.feeds];
    newFeeds[index][field] = value;
    formik.setFieldValue("feeds", newFeeds);
  };

  const addFeed = () => {
    formik.setFieldValue("feeds", [...formik.values.feeds, { feedId: "", quantity: "" }]);
  };

  return (
    <div className="container">
    
      <form onSubmit={formik.handleSubmit} className="mt-5">
        {isLoading ? (
           <div className="d-flex vaccine align-items-center justify-content-between">
                                               <div className="title-v">Add Feed for locationshed</div>
                                               <button type="submit" className="btn button2" disabled={isLoading}>
                                                   {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <IoIosSave />} Save
                                               </button>
                                           </div>
        ) : (
            <div className="d-flex vaccine align-items-center justify-content-between">
                                                <div className="title-v">Add Feed for locationshed</div>
                                                <button type="submit" className="btn button2" disabled={isLoading}>
                                                    {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <IoIosSave />} Save
                                                </button>
                                            </div>
        )}

        <div className="animaldata">
          <div className="input-box">
            <label className="label" htmlFor="locationShed">Location Shed</label>
            <input
              id="locationShed"
              name="locationShed"
              type="text"
              className="input2"
              placeholder="Enter location shed"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.locationShed}
            />
            {formik.errors.locationShed && formik.touched.locationShed && (
              <p className="text-danger">{formik.errors.locationShed}</p>
            )}
          </div>

          <div className="input-box">
            <label className="label" htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              className="input2"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.date}
            />
            {formik.errors.date && formik.touched.date && (
              <p className="text-danger">{formik.errors.date}</p>
            )}
          </div>
        </div>

        {/* Loop through the feeds array to create a dynamic dropdown for each feed */}
        {formik.values.feeds.map((feed, index) => (
          <div key={index} >
            <div className="input-box">
              <label className="label" htmlFor={`feeds[${index}].feedId`}>Feed Name</label>
              <select
                id={`feeds[${index}].feedId`}
                name={`feeds[${index}].feedId`}
                className="input2"
                value={feed.feedId}
                onChange={(e) => handleFeedChange(index, 'feedId', e.target.value)}
                onBlur={formik.handleBlur}
              >
                <option value="">Select Feed</option>
                {feeds.map((feedOption) => (
                  <option key={feedOption._id} value={feedOption._id}>
                    {feedOption.name}
                  </option>
                ))}
              </select>
              {formik.errors.feeds && formik.errors.feeds[index] && formik.errors.feeds[index].feedId && (
                <p className="text-danger">{formik.errors.feeds[index].feedId}</p>
              )}

              <label className="label" htmlFor={`feeds[${index}].quantity`}>Quantity</label>
              <input
                type="number"
                id={`feeds[${index}].quantity`}
                name={`feeds[${index}].quantity`}
                className="input2"
                value={feed.quantity}
                onChange={(e) => handleFeedChange(index, 'quantity', e.target.value)}
                onBlur={formik.handleBlur}
                placeholder="Enter quantity"
              />
              {formik.errors.feeds && formik.errors.feeds[index] && formik.errors.feeds[index].quantity && (
                <p className="text-danger">{formik.errors.feeds[index].quantity}</p>
              )}
            </div>
          </div>
        ))}

        <button type="button" onClick={addFeed} className="btn button2">Add Feed</button>
      </form>
    </div>
  );
}
