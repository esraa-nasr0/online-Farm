import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import { IoIosSave } from 'react-icons/io';
import { Feedcontext } from '../../Context/FeedContext';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function EditFodder() {
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feeds, setFeeds] = useState([]);
  const { getFodderMenue } = useContext(Feedcontext);
  const { id } = useParams();

  const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
    return { Authorization: formattedToken };
  };

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const { data } = await getFodderMenue();
        if (data.status === 'success') {
          setFeeds(data.data);
        }
      } catch (err) {
        setError(t('fetchFeedError'));
      }
    };
    fetchFeeds();
  }, [getFodderMenue, t]);

  useEffect(() => {
    const fetchFodder = async () => {
      const headers = getHeaders();
      setError(null);
      try {
        const { data } = await axios.get(
          `https://farm-project-bbzj.onrender.com/api/fodder/getsinglefodder/${id}`,
          { headers }
        );
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
        setError(t('fetchFodderError'));
      }
    };
    fetchFodder();
  }, [id, t]);

  const submitFodder = async (values) => {
    const headers = getHeaders();
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
          title: t('successTitle'),
          text: t('successMessage'),
          icon: 'success',
          confirmButtonText: t('ok'),
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || t('submitError'));
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="title2">{t('editFodder')}</div>
      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={formik.handleSubmit}>
        <button type="submit" className="btn button2" disabled={isLoading}>
          {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <IoIosSave />} {t('save')}
        </button>

        <div className="animaldata">
          <div className="input-box">
            <label className="label" htmlFor="name">{t('name')}</label>
            <input
              {...formik.getFieldProps('name')}
              id="name"
              type="text"
              className="input2"
              placeholder={t('enterFeedName')}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-danger">{formik.errors.name}</p>
            )}
          </div>

          {formik.values.feeds.map((feed, index) => (
            <div key={index} className="input-box">
              <label className="label" htmlFor={`feeds[${index}].feedId`}>{t('feedName')}</label>
              <select
                id={`feeds[${index}].feedId`}
                name={`feeds[${index}].feedId`}
                className="input2"
                value={feed.feedId}
                onChange={(e) => handleFeedChange(index, 'feedId', e.target.value)}
                onBlur={formik.handleBlur}
              >
                <option value="">{t('selectFeed')}</option>
                {feeds.map((feedOption) => (
                  <option key={feedOption._id} value={feedOption._id}>
                    {feedOption.name}
                  </option>
                ))}
              </select>

              <label className="label" htmlFor={`feeds[${index}].quantity`}>{t('quantity')}</label>
              <input
                type="number"
                id={`feeds[${index}].quantity`}
                name={`feeds[${index}].quantity`}
                className="input2"
                value={feed.quantity}
                onChange={(e) => handleFeedChange(index, 'quantity', e.target.value)}
                onBlur={formik.handleBlur}
                placeholder={t('enterQuantity')}
              />
            </div>
          ))}
        </div>

        <button type="button" onClick={addFeed} className="btn button2">+</button>
      </form>
    </div>
  );
}
