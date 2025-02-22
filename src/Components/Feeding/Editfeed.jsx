import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';
export default function Editfeed() {
  let { id } = useParams();
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
      const headers = getHeaders(); // Get the latest headers
      try {
        setIsLoading(true);
        const response = await axios.patch(
          `https://farm-project-bbzj.onrender.com/api/feed/updatefeed/${id}`,
          values,
          { headers }
        );
        console.log(response);
       if (response.data.status === "success") {
                                   Swal.fire({
                                       title: "Success!",
                                       text: "Data has been submitted successfully!",
                                       icon: "success",
                                       confirmButtonText: "OK",
                                   }).then(() => navigate('/feedingTable'));
                         console.log('API Response:', response.data);
                
                     }}
                     catch (err) {
                       
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
      const headers = getHeaders(); // Get the latest headers
      try {
        const { data } = await axios.get(
          `https://farm-project-bbzj.onrender.com/api/feed/getsinglefeed/${id}`,
          { headers }
        );
        // console.log(data);
        
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
    <div className="container">
      <div className="title2">Edit Feed</div>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={formik.handleSubmit} className="mt-5">
        <button type="submit" className="btn button2" disabled={isLoading}>
          {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Save'}
        </button>

        <div className="animaldata">
          <div className="input-box">
            <label className="label" htmlFor="feedName">Feed Name</label>
            <input
              id="feedName"
              name="feedName"
              type="text"
              className="input2"
              placeholder="Enter feed name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
          </div>

          <div className="input-box">
            <label className="label" htmlFor="price">price</label>
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


          <div className="input-box">
            <label className="label" htmlFor="type">type</label>
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

          <div className="input-box">
            <label className="label" htmlFor="DateGiven">concentration Of Dry Matter</label>
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
      </form>
    </div>
  );
}
