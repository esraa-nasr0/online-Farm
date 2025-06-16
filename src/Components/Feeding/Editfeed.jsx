import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';
import { IoIosSave } from 'react-icons/io';
import './Feeding.css';

export default function Editfeed() {
  let { id } = useParams();
  const navigate = useNavigate();
      
  const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
    return { Authorization: formattedToken };
  };

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      type: '',
      concentrationOfDryMatter: '',
    },
    onSubmit: async (values) => {
      const headers = getHeaders();
      try {
        setIsLoading(true);
        const response = await axios.patch(
          `https://farm-project-bbzj.onrender.com/api/feed/updatefeed/${id}`,
          values,
          { headers }
        );
        if (response.data.status === "success") {
          Swal.fire({
            title: "Success!",
            text: "Data has been submitted successfully!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => navigate('/feedingTable'));
        }
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: err.response?.data?.message || "An error occurred while submitting data.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    async function fetchfeed() {
      const headers = getHeaders();
      try {
        const { data } = await axios.get(
          `https://farm-project-bbzj.onrender.com/api/feed/getsinglefeed/${id}`,
          { headers }
        );
        if (data.data.feed) {
          const feed = data.data.feed;
          formik.setValues({
            name: feed.name || '',
            price: feed.price || '',
            type: feed.type || '',
            concentrationOfDryMatter: feed.concentrationOfDryMatter || '',
          });
        }
      } catch (err) {
        setError('Failed to fetch feed data');
        console.error(err);
      }
    }
    fetchfeed();
  }, [id]);

  return (
    <div className="feeding-container">
      <div className="feeding-header">
        <h1>Edit Feed</h1>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={formik.handleSubmit} className="feeding-form">
        <div className="form-grid">
          <div className="form-section">
            <h2>Feed Information</h2>
            <div className="input-group">
              <label htmlFor="name">Feed Name</label>
              <input
                id="name"
                name="name"
                type="text"
                className="input2"
                placeholder="Enter feed name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
            </div>

            <div className="input-group">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                type="text"
                className="input2"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.price}
              />
            </div>

            <div className="input-group">
              <label htmlFor="type">Type</label>
              <input
                id="type"
                name="type"
                type="text"
                className="input2"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.type}
              />
            </div>

            <div className="input-group">
              <label htmlFor="concentrationOfDryMatter">Concentration of Dry Matter</label>
              <input
                id="concentrationOfDryMatter"
                name="concentrationOfDryMatter"
                type="text"
                className="input2"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.concentrationOfDryMatter}
              />
            </div>
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
