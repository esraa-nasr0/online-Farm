import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import { IoIosSave } from 'react-icons/io';
import { Feedcontext } from '../../Context/FeedContext';
import { useParams } from 'react-router-dom';

export default function EditFodder() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feeds, setFeeds] = useState([]);
  const { getFodderMenue } = useContext(Feedcontext);
  const { id } = useParams();

  const Authorization = localStorage.getItem('Authorization');
  const headers = { Authorization: `Bearer ${Authorization}` };

  // Fetch available feeds
  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const { data } = await getFodderMenue();
        if (data.status === 'success') {
          setFeeds(data.data);
        }
      } catch (err) {
        setError('Failed to load feed data');
      }
    };
    fetchFeeds();
  }, [getFodderMenue]);

  // Fetch existing fodder data
  useEffect(() => {
    const fetchFodder = async () => {
      setError(null);
      try {
        const { data } = await axios.get(
          `https://farm-project-bbzj.onrender.com/api/fodder/getsinglefodder/${id}`,
          { headers }
        );
        console.log("API response:", data);

        if (data?.data?.fodder) {
          const fodder = data.data.fodder;
          formik.setValues({
            name: fodder.name || '',
            feeds: fodder.components.map(comp => ({
              feedId: comp.feedId || '',
              quantity: comp.quantity || '',
            })) || [{ feedId: '', quantity: '' }],
          });
        } else {
          throw new Error("Unexpected API response structure");
        }
      } catch (error) {
        console.error("Failed to fetch fodder data:", error);
        setError("Failed to fetch fodder details.");
      }
    };
    fetchFodder();
  }, [id]);

  // Handle form submission
  const submitFodder = async (values) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.patch(
        `https://farm-project-bbzj.onrender.com/api/fodder/updatefodder/${id}`,
        values,
        { headers }
      );

      if (data.status === 'success') {
        Swal.fire({
          title: 'Success!',
          text: 'Fodder data updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      console.log(err.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      name: '',
      feeds: [{ feedId: '', quantity: '' }],
    },
    onSubmit: submitFodder,
  });

  // Add new feed input
  const addFeed = () => {
    formik.setFieldValue('feeds', [...formik.values.feeds, { feedId: '', quantity: '' }]);
  };

  // Handle feed selection and quantity change
  const handleFeedChange = (index, field, value) => {
    const newFeeds = [...formik.values.feeds];
    newFeeds[index][field] = value;
    formik.setFieldValue('feeds', newFeeds);
  };

  return (
    <div className="container">
      <div className="title2">Edit Fodder</div>
      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={formik.handleSubmit}>
        <button type="submit" className="btn button2" disabled={isLoading}>
          {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <IoIosSave />} Save
        </button>

        <div className="animaldata">
          <div className="input-box">
            <label className="label" htmlFor="name">Name</label>
            <input
              {...formik.getFieldProps('name')}
              id="name"
              type="text"
              className="input2"
              placeholder="Enter feed name"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-danger">{formik.errors.name}</p>
            )}
          </div>

          {/* Render dynamic feed input fields */}
          {formik.values.feeds.map((feed, index) => (
            <div key={index} className="input-box">
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
            </div>
          ))}
        </div>

        <button type="button" onClick={addFeed} className="btn button2">+</button>
      </form>
    </div>
  );
}
