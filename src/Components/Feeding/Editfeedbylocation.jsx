import axios from "axios";
import { useFormik } from "formik";
import  { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LocationContext } from "../../Context/LocationContext";
import { IoIosSave } from "react-icons/io";
import { Feedcontext } from "../../Context/FeedContext";
import "./Feeding.css";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

export default function EditFeedbyLocation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { LocationMenue } = useContext(LocationContext);
  const [locationSheds, setLocationSheds] = useState([]);
  const [feedOptions, setFeedOptions] = useState([]);
  const { getFodderMenue } = useContext(Feedcontext);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const getHeaders = () => {
    const Authorization = localStorage.getItem("Authorization");
    const formattedToken = Authorization.startsWith("Bearer ")
      ? Authorization
      : `Bearer ${Authorization}`;
    return { Authorization: formattedToken };
  };

  const fetchLocationSheds = async () => {
    try {
      const { data } = await LocationMenue();
      if (data.status === "success" && Array.isArray(data.data.locationSheds)) {
        setLocationSheds(data.data.locationSheds);
      } else {
        setLocationSheds([]);
      }
    } catch (err) {
      setError(t("error_fetch_location"));
      setLocationSheds([]);
    }
  };

  const fetchFeedOptions = async () => {
    try {
      const { data } = await getFodderMenue();
      if (data.status === "success" && Array.isArray(data.data)) {
        setFeedOptions(data.data);
      } else {
        setFeedOptions([]);
      }
    } catch (err) {
      console.error("Feed fetch error:", err);
      setError(t("error_fetch_feed"));
      setFeedOptions([]);
    }
  };

  useEffect(() => {
    fetchLocationSheds();
    fetchFeedOptions();
  }, []);

  const formik = useFormik({
    initialValues: {
      locationShed: "",
      feeds: [{ feedId: "", quantity: "" }],
      date: "",
    },
    onSubmit: async (values) => {
      const headers = getHeaders();
      try {
        setIsLoading(true);
        const requestData = {
          locationShed: values.locationShed,
          date: values.date,
          feeds: values.feeds.map((feed) => ({
            feedId: feed.feedId,
            quantity: Number(feed.quantity),
          })),
        };
        const response = await axios.patch(
          `https://farm-project-bbzj.onrender.com/api/feed/updatefeedByShed/${id}`,
          requestData,
          { headers }
        );

        if (response.data.status === "SUCCESS") {
          await Swal.fire({
            title: t("success_title"),
            text: response.data.message || t("animal_update_success"),
            icon: "success",
            confirmButtonText: t("ok"),
          });
          navigate("/feedlocationtable");
        }
      } catch (err) {
        setError(t("error_update_feed"));
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

        if (data.data.feedShed) {
          const feedShed = data.data.feedShed;
          formik.setValues({
            locationShed: feedShed.locationShed?._id || "",
            feeds: feedShed.feeds.map((feed) => ({
              feedId: feed._id || feed.feedId || "",
              quantity: feed.quantity || "",
            })),
            date: feedShed.date
              ? new Date(feedShed.date).toISOString().slice(0, 10)
              : "",
          });
        }
      } catch (err) {
        setError(t("error_fetch_feed_data"));
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
    formik.setFieldValue("feeds", [
      ...formik.values.feeds,
      { feedId: "", quantity: "" },
    ]);
  };

  return (
    <div className="feeding-container">
      <div className="feeding-header container">
        <h1>{t("edit_feed_by_location")}</h1>
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
                {locationSheds.map((shed) => (
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
                <label htmlFor={`feeds[${index}].feedId`}>
                  {t("feed_name")}
                </label>
                <select
                  id={`feeds[${index}].feedId`}
                  name={`feeds[${index}].feedId`}
                  value={feed.feedId}
                  onChange={(e) =>
                    handleFeedChange(index, "feedId", e.target.value)
                  }
                  onBlur={formik.handleBlur}
                >
                  <option value="">{t("select_feed")}</option>
                  {feedOptions.map((feedOption) => (
                    <option key={feedOption._id} value={feedOption._id}>
                      {feedOption.name}
                    </option>
                  ))}
                </select>

                <label htmlFor={`feeds[${index}].quantity`}>
                  {t("quantity")}
                </label>
                <input
                  type="number"
                  id={`feeds[${index}].quantity`}
                  name={`feeds[${index}].quantity`}
                  value={feed.quantity}
                  onChange={(e) =>
                    handleFeedChange(index, "quantity", e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  placeholder={t("enter_quantity")}
                />
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
              <span className="loading-spinner">{t("loading")}</span>
            ) : (
              <>
                <IoIosSave /> {t("save")}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
