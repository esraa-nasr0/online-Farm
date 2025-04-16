// EditFeed.jsx
import axios from 'axios';
import { useFormik } from 'formik';
import React, {useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LocationContext } from '../../Context/LocationContext';
import { IoIosSave } from 'react-icons/io';
import { Feedcontext } from '../../Context/FeedContext';


export default function EditFeedbyLocation() {
  const { id } = useParams();
  const navigate = useNavigate();
    const {LocationMenue} = useContext(LocationContext)
    const [feeds, setFeeds] = useState([]);
  const { getFodderMenue } = useContext(Feedcontext);

  
  // Helper function to generate headers with the latest token
  const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
  
    // Ensure the token has only one "Bearer" prefix
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
  
    return {
        Authorization: formattedToken
    };
  };

  const fetchLocation = async () => {
              try {
                  const { data } = await LocationMenue();
                  if (data.status === 'success' && Array.isArray(data.data.locationSheds)) {
                    setFeeds(data.data.locationSheds);
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
                setFeeds(data.data);
              }
            } catch (err) {
              setError('Failed to load Feed data');
            }
          };

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      locationShed: '',
      feeds: [{ feedName: '', quantity: 0 }],
      date: '',
    },
    onSubmit: async (values) => {
      const headers = getHeaders(); // Get the latest headers
      try {
        setIsLoading(true);
        const req = await axios.patch(
          `https://farm-project-bbzj.onrender.com/api/feed/updatefeedByShed/${id}`,
          values,
          { headers }
        );
        console.log(req);
        navigate('/feedlocationtable');
      } catch (err) {
        setError('Failed to update the feed');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    async function fetchFeedData() {
      const headers = getHeaders(); // Get the latest headers
      try {
        const { data } = await axios.get(
          `https://farm-project-bbzj.onrender.com/api/feed/getsingleFeedByShed/${id}`,
          { headers }
        );
        if (data.data.feedShed) {
            formik.setValues({
              locationShed: data.data.feedShed.locationShed || '',
              feeds: [
                {
                  feedName: data.data.feedShed.feedName || '',
                  quantity: data.data.feedShed.quantity || 0,
                },
              ],
              date: data.data.feedShed.date
                ? new Date(data.data.feedShed.date).toISOString().slice(0, 16)
                : '',
            });
          }
          
      } catch (err) {
        setError('Failed to fetch feed data');
        console.error(err);
      }
    }

    fetchFeedData();
  }, [id]);

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
        {feeds && feeds.map((shed) => (
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
    
            <button type="button" onClick={addFeed} className="btn button2">+</button>
          </form>
        </div>
  );
}
