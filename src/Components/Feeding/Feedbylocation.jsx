import axios from "axios";
import { useFormik } from "formik";
import { useContext, useState, useEffect } from 'react';
import { IoIosSave } from 'react-icons/io';
import { Feedcontext } from '../../Context/FeedContext';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { LocationContext } from '../../Context/LocationContext';
import './Feeding.css';
import { useTranslation } from "react-i18next";

export default function Feedbylocation() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feeds, setFeeds] = useState([]);
  const { getFodderMenue } = useContext(Feedcontext);
  const navigate = useNavigate();
  const { LocationMenue } = useContext(LocationContext);
  const [feedName, setFeedName] = useState([]);
  const [locationSheds, setLocationSheds] = useState([]);
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
    return { Authorization: formattedToken };
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
      setError(t("error_fetch_location"));
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
      setError(t("error_fetch_feed"));
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
        { headers }
      );
      if (response.data.status === "SUCCESS") {
        setIsSubmitted(true);
        Swal.fire({
          title: t("success_title"),
          text: `${t("submit_success_message")}\n${t("total_feed_cost")}: ${response.data.totalFeedCost}\n${t("per_animal_feed_cost")}: ${response.data.perAnimalFeedCost}`,
          icon: "success",
          confirmButtonText: t("ok"),
        })
      }
    } catch (err) {
      Swal.fire({
        title: t("error_title"),
        text: err.response?.data?.message || t("submit_error_message"),
        icon: "error",
        confirmButtonText: t("ok"),
      });
    } finally {
      setIsLoading(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      locationShed: "",
      feeds: [{ feedId: "", quantity: "" }],
      date: ""
    },
    onSubmit: (values) => {
      post(values);
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

  const removeFeed = (index) => {
    if (!isSubmitted) {
      const updatedFeeds = [...formik.values.feeds];
      updatedFeeds.splice(index, 1);
      formik.setFieldValue("feeds", updatedFeeds);
    }
  };

  return (
    <div className="feeding-container">
      <div className="feeding-header container">
        <h1>{t("feed_by_location_shed")}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={formik.handleSubmit} className="feeding-form container">
        <div className="form-grid">
          <div className="form-section">
            <h2>{t("location_info")}</h2>
            <div className="input-group">
              <label htmlFor="locationShed">{t("location_shed")}</label>
              <select
                id="locationShed"
                name="locationShed"
                value={formik.values.locationShed}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">{t("select_location_shed")}</option>
                {locationSheds && locationSheds.map((shed) => (
                  <option key={shed._id} value={shed._id}>
                    {shed.locationShedName}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="date">{t("date")}</label>
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
            <h2>{t("feed_details")}</h2>
            {formik.values.feeds.map((feed, index) => (
              <div key={index} className="input-group">
                <label htmlFor={`feeds[${index}].feedId`}>{t("feed_name")}</label>
                <select
                  id={`feeds[${index}].feedId`}
                  name={`feeds[${index}].feedId`}
                  value={feed.feedId}
                  onChange={(e) => handleFeedChange(index, 'feedId', e.target.value)}
                  onBlur={formik.handleBlur}
                >
                  <option value="">{t("select_feed")}</option>
                  {feedName.map((feedOption) => (
                    <option key={feedOption._id} value={feedOption._id}>
                      {feedOption.name}
                    </option>
                  ))}
                </select>

                <label htmlFor={`feeds[${index}].quantity`}>{t("quantity")}</label>
                <input
                  type="number"
                  id={`feeds[${index}].quantity`}
                  name={`feeds[${index}].quantity`}
                  value={feed.quantity}
                  onChange={(e) => handleFeedChange(index, 'quantity', e.target.value)}
                  onBlur={formik.handleBlur}
                  placeholder={t("enter_quantity")}
                />

                {/* زرار إزالة الـ feed */}
                {formik.values.feeds.length > 1 && !isSubmitted && (
                  <div className="remove-treatment-wrapper">
                    <button
                      type="button"
                      className="remove-treatment-button  mt-2"
                      onClick={() => removeFeed(index)}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button type="button" onClick={addFeed} className="add-feed-button">
              {t("+")}
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-button" disabled={isLoading}>
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <IoIosSave /> {t("save")}
              </>
            )}
          </button>
          
          {isSubmitted && (
            <button
              type="button"
              className="save-button"
              onClick={() => {
                formik.resetForm();
                setIsSubmitted(false);
              }}
            >
              {t('add_new_feed')}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
