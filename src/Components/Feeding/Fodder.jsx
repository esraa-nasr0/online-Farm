import axios from 'axios';
import { useFormik } from 'formik';
import { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import { IoIosSave } from 'react-icons/io';
import { Feedcontext } from '../../Context/FeedContext';
import { useTranslation } from 'react-i18next';
import './Feeding.css';

export default function Fodder() {
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fooderData, setFooderData] = useState(null);
  const [feeds, setFeeds] = useState([]);
  const { getFodderMenue } = useContext(Feedcontext);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
    return { Authorization: formattedToken };
  };

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

  useEffect(() => {
    fetchFeeds();
  }, [getFodderMenue]);

  async function submitFodder(value) {
    if (isSubmitted) return;
    const headers = getHeaders();
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
        setIsSubmitted(true);
        formik.resetForm();
        setFooderData(data.data.fodder);
        Swal.fire({
          title: t('successTitle'),
          text: t('successMessage'),
          icon: 'success',
          confirmButtonText: t('ok'),
        });
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message || t('submitError'));
      console.log(err.response?.data);
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
    if (!isSubmitted) {
      formik.setFieldValue('feeds', [...formik.values.feeds, { feedId: '', quantity: '' }]);
    }
  };

  const removeFeed = (index) => {
    if (!isSubmitted) {
      const updatedFeeds = [...formik.values.feeds];
      updatedFeeds.splice(index, 1);
      formik.setFieldValue('feeds', updatedFeeds);
    }
  };

  const handleFeedChange = (index, field, value) => {
    if (!isSubmitted) {
      const newFeeds = [...formik.values.feeds];
      newFeeds[index][field] = field === 'quantity' ? Number(value) : value;
      formik.setFieldValue('feeds', newFeeds);
    }
  };

  const resetForm = () => {
    formik.resetForm({
      values: {
        name: '',
        feeds: [{ feedId: '', quantity: '' }],
      }
    });
    setIsSubmitted(false);
  };

  return (
    <div className="feeding-container">
      <div className="feeding-header container">
        <h1>{t('fodderTitle')}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isSubmitted && (
        <div className="success-message">
          <h3>{t('fodderAddedSuccessfully')}</h3>
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="feeding-form container">
        <div className="form-grid">
          <div className="form-section">
            <h2>{t('fodderDetails')}</h2>
            <div className="input-group">
              <label htmlFor="name">{t('foddernames')}</label>
              <input
                {...formik.getFieldProps('name')}
                placeholder={t('enterFeedName')}
                id="name"
                type="text"
                disabled={isSubmitted}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-danger">{formik.errors.name}</p>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2>{t('feedComponents')}</h2>
            {formik.values.feeds.map((feed, index) => (
              <div key={index} className="input-group">
                <label htmlFor={`feeds[${index}].feedId`}>{t('feedName')}</label>
                <select
                  id={`feeds[${index}].feedId`}
                  name={`feeds[${index}].feedId`}
                  value={feed.feedId}
                  onChange={(e) => handleFeedChange(index, 'feedId', e.target.value)}
                  onBlur={formik.handleBlur}
                  disabled={isSubmitted}
                >
                  <option value="">{t('selectFeed')}</option>
                  {feeds.map((feedOption) => (
                    <option key={feedOption._id} value={feedOption._id}>
                      {feedOption.name}
                    </option>
                  ))}
                </select>

                <label htmlFor={`feeds[${index}].quantity`}>{t('quantity')}</label>
                <input
                  type="number"
                  id={`feeds[${index}].quantity`}
                  name={`feeds[${index}].quantity`}
                  value={feed.quantity}
                  onChange={(e) => handleFeedChange(index, 'quantity', e.target.value)}
                  onBlur={formik.handleBlur}
                  placeholder={t('enterQuantity')}
                  disabled={isSubmitted}
                />

                {/* زرار الحذف */}
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
            <button type="button" onClick={addFeed} className="add-feed-button" disabled={isSubmitted}>
              +
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-button" disabled={isLoading || isSubmitted || !formik.isValid}>
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <IoIosSave /> {t('save')}
              </>
            )}
          </button>
          
          {isSubmitted && (
            <button
              type="button"
              className="save-button"
              onClick={resetForm}
            >
              {t('add_new_feed')}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
