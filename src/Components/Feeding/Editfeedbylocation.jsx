// EditFeed.jsx
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditFeedbyLocation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const Authorization = localStorage.getItem('Authorization');
  const headers = {
    Authorization: `Bearer ${Authorization}`,
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

  return (
    <div className="container">
      <div className="title2">Edit Feed</div>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={formik.handleSubmit} className="mt-5">
        <button type="submit" className="btn button2" disabled={isLoading}>
          {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Save'}
        </button>

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
          </div>

          {formik.values.feeds.map((feed, index) => (
            <div key={index} className="input-box">
              <label className="label" htmlFor={`feeds[${index}].feedName`}>Feed Name</label>
              <input
                id={`feeds[${index}].feedName`}
                name={`feeds[${index}].feedName`}
                type="text"
                className="input2"
                placeholder="Enter feed name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.feeds[index]?.feedName}
              />

              <label className="label" htmlFor={`feeds[${index}].quantity`}>Quantity</label>
              <input
                id={`feeds[${index}].quantity`}
                name={`feeds[${index}].quantity`}
                type="number"
                className="input2"
                placeholder="Enter quantity"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.feeds[index]?.quantity}
              />
            </div>
          ))}

          <div className="input-box">
            <label className="label" htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              type="datetime-local"
              className="input2"
              placeholder="Enter date"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.date}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
