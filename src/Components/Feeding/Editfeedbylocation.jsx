import axios from 'axios';
import { useFormik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LocationContext } from '../../Context/LocationContext';
import { IoIosSave } from 'react-icons/io';
import { Feedcontext } from '../../Context/FeedContext';
import './Feeding.css';

export default function EditFeedbyLocation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { LocationMenue } = useContext(LocationContext);
  const [locationSheds, setLocationSheds] = useState([]);
  const [feedOptions, setFeedOptions] = useState([]);
  const { getFodderMenue } = useContext(Feedcontext);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
    return { Authorization: formattedToken };
  };

  const fetchLocationSheds = async () => {
    try {
      const { data } = await LocationMenue();
      if (data.status === 'success' && Array.isArray(data.data.locationSheds)) {
        setLocationSheds(data.data.locationSheds);
      } else {
        setLocationSheds([]);
      }
    } catch (err) {
      setError('Failed to load location data');
      setLocationSheds([]);
    }
  };

  const fetchFeedOptions = async () => {
    try {
      const { data } = await getFodderMenue();
      console.log('Feed API Response:', data); // For debugging
      if (data.status === 'success' && Array.isArray(data.data)) {
        setFeedOptions(data.data);
      } else {
        setFeedOptions([]);
      }
    } catch (err) {
      console.error('Feed fetch error:', err);
      setError('Failed to load Feed data');
      setFeedOptions([]);
    }
  };

  useEffect(() => {
    fetchLocationSheds();
    fetchFeedOptions();
  }, []);

  const formik = useFormik({
    initialValues: {
      locationShed: '',
      feeds: [{ feedId: '', quantity: '' }],
      date: '',
    },
    onSubmit: async (values) => {
      const headers = getHeaders();
      try {
        setIsLoading(true);
        await axios.patch(
          `https://farm-project-bbzj.onrender.com/api/feed/updatefeedByShed/${id}`,
          values,
          { headers }
        );
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
      const headers = getHeaders();
      try {
        const { data } = await axios.get(
          `https://farm-project-bbzj.onrender.com/api/feed/getsingleFeedByShed/${id}`,
          { headers }
        );
        
        console.log('API Response:', data); // للتصحيح
        
        if (data.data.feedShed) {
          const feedShed = data.data.feedShed;
          formik.setValues({
            locationShed: feedShed.locationShed?._id || '',
            feeds: feedShed.feeds.map(feed => ({
              feedId: feed._id || feed.feedId || '',
              quantity: feed.quantity || ''
            })),
            date: feedShed.date
              ? new Date(feedShed.date).toISOString().slice(0, 10)
              : '',
          });
        }
      } catch (err) {
        setError('Failed to fetch feed data');
        console.error(err);
      }
    }
    fetchFeedData();
  }, [id, feedOptions]);

  const handleFeedChange = (index, field, value) => {
    const newFeeds = [...formik.values.feeds];
    newFeeds[index][field] = value;
    formik.setFieldValue("feeds", newFeeds);
  };

  const addFeed = () => {
    formik.setFieldValue("feeds", [...formik.values.feeds, { feedId: "", quantity: "" }]);
  };

  return (
    <div className="feeding-container">
      <div className="feeding-header">
        <h1>Edit Feed by Location</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={formik.handleSubmit} className="feeding-form">
        <div className="form-grid">
          <div className="form-section">
            <h2>Location Information</h2>
            <div className="input-group">
              <label htmlFor="locationShed">Location Shed</label>
              <select
                id="locationShed"
                name="locationShed"
                value={formik.values.locationShed}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Select location shed</option>
                {locationSheds.map((shed) => (
                  <option key={shed._id} value={shed._id}>
                    {shed.locationShedName}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                name="date"
                type="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Feed Details</h2>
            {formik.values.feeds.map((feed, index) => (
              <div key={index} className="input-group">
                <label htmlFor={`feeds[${index}].feedId`}>Feed Name</label>
                <select
                  id={`feeds[${index}].feedId`}
                  name={`feeds[${index}].feedId`}
                  value={feed.feedId}
                  onChange={(e) => handleFeedChange(index, 'feedId', e.target.value)}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select Feed</option>
                  {feedOptions.map((feedOption) => (
                    <option key={feedOption._id} value={feedOption._id}>
                      {feedOption.name}
                    </option>
                  ))}
                </select>

                <label htmlFor={`feeds[${index}].quantity`}>Quantity</label>
                <input
                  type="number"
                  id={`feeds[${index}].quantity`}
                  name={`feeds[${index}].quantity`}
                  value={feed.quantity}
                  onChange={(e) => handleFeedChange(index, 'quantity', e.target.value)}
                  onBlur={formik.handleBlur}
                  placeholder="Enter quantity"
                />
              </div>
            ))}
            <button type="button" onClick={addFeed} className="add-feed-button">
              +
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-button" disabled={isLoading}>
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <IoIosSave /> Save
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}