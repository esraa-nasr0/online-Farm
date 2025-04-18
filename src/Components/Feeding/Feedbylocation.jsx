import React, { useContext, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { IoIosSave } from 'react-icons/io';
import axios from 'axios';
import { Feedcontext } from '../../Context/FeedContext';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { LocationContext } from '../../Context/LocationContext';


export default function Feedbylocation() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feeds, setFeeds] = useState([]);
  const { getFodderMenue } = useContext(Feedcontext);
  const navigate = useNavigate()
  const {LocationMenue} = useContext(LocationContext)
  const [feedName, setFeedName] = useState([]);
  const [locationSheds, setLocationSheds] = useState([]);
  


const getHeaders = () => {
  const Authorization = localStorage.getItem('Authorization');
  const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
  return {
      Authorization: formattedToken
  };
};

const fetchLocation = async () => {
            try {
                const { data } = await LocationMenue();
                if (data.status === 'success' && Array.isArray(data.data.locationSheds)) {
                  setLocationSheds(data.data.locationSheds);
                } else {
                  setFeeds([]); 
                }
            } catch (err) {
                setError('Failed to load treatment data');
                setFeeds([]); 
            }
        };
    
        useEffect(() => {
            fetchLocation();
        }, [LocationMenue]);

  const fetchFeeds = async () => {
    try {
      const { data } = await getFodderMenue();
      if (data.status === 'success') {
        setFeedName(data.data);
      }
    } catch (err) {
      setError('Failed to load Feed data');
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, [getFodderMenue]);

  async function post(values) {
    const headers = getHeaders(); 

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
    <div className="title2">Feed by location shed</div>
      <form onSubmit={formik.handleSubmit} className="mt-5">
        {isLoading ? (
                <button type="submit" className="btn button2">
                    <i className="fas fa-spinner fa-spin"></i>
                </button>
                ) : (
                <button type="submit" className="btn button2">
                    <IoIosSave /> Save
                </button>
                )}

        <div className="animaldata">
        <div className="input-box">
    <label className="label" htmlFor="locationShed">Location Shed</label>
    <select
        id="locationShed"
        name="locationShed"
        className="input2"
        value={formik.values.locationShed}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
    >
        <option value="">select location shed</option>
        {locationSheds && feeds.map((shed) => (
            <option key={shed._id} value={shed._id}>{shed.locationShedName}</option>
        ))}
    </select>
    {formik.errors.locationShed && formik.touched.locationShed && <p className="text-danger">{formik.errors.locationShed}</p>}
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
                {feedName.map((feedOption) => (
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

        <button type="button" onClick={addFeed} className="btn button2">+</button>
      </form>
    </div>
  );
}
