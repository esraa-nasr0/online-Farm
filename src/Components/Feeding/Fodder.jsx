import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import { IoIosSave } from 'react-icons/io';
import { Feedcontext } from '../../Context/FeedContext';

export default function Fodder() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fooderData, setFooderData] = useState(null);
  const [feeds, setFeeds] = useState([]);
  const { getFodderMenue } = useContext(Feedcontext);

  const Authorization = localStorage.getItem('Authorization');
  const headers = {
    Authorization: `Bearer ${Authorization}`,
  };

  // Fetch the available feeds from the API
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

  async function submitFodder(value) {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(
        'https://farm-project-bbzj.onrender.com/api/fodder/addfodder',
        value,
        { headers }
      );

      if (data.status === 'success') {
        setIsLoading(false);
        setFooderData(data.data.fodder);
        Swal.fire({
          title: 'Success!',
          text: 'Fodder data added successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message);
      console.log(err.response.data);
    }
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      feeds: [{ feedId: '', quantity: '' }],
    },
    onSubmit: submitFodder,
  });

  const addFeed = () => {
    formik.setFieldValue('feeds', [...formik.values.feeds, { feedId: '', quantity: '' }]);
  };

  const handleFeedChange = (index, field, value) => {
    const newFeeds = [...formik.values.feeds];
    newFeeds[index][field] = value;
    formik.setFieldValue('feeds', newFeeds);
  };

  return (
    <div className="container">
      <div className="title2">Fodder</div>
      <p className="text-danger">{error}</p>

      <form onSubmit={formik.handleSubmit}>
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
            <label className="label" htmlFor="name">
              Name
            </label>
            <input
              {...formik.getFieldProps('name')}
              placeholder="Enter feed name"
              id="name"
              type="text"
              className="input2"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-danger">{formik.errors.name}</p>
            )}
          </div>

          {/* Loop through the feeds array to create a dynamic dropdown for each feed */}
          {formik.values.feeds.map((feed, index) => (
            <div key={index} className="input-box">
              <label className="label" htmlFor={`feeds[${index}].feedId`}>
                Feed Name
              </label>
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
              {formik.errors.feeds && formik.touched.feeds && (
                <p className="text-danger">{formik.errors.feeds}</p>
              )}

              <label className="label" htmlFor={`feeds[${index}].quantity`}>
                Quantity
              </label>
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
            </div>
          ))}
        </div>

        <button type="button" onClick={addFeed} className="btn button2">
          +
        </button>
      </form>
    </div>
  );
}
