import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import { IoIosSave } from 'react-icons/io';
import { Feedcontext } from '../../Context/FeedContext';
import { useTranslation } from 'react-i18next';

export default function Fodder() {
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fooderData, setFooderData] = useState(null);
  const [feeds, setFeeds] = useState([]);
  const { getFodderMenue } = useContext(Feedcontext);
  const [isSubmitted, setIsSubmitted] = useState(false); // حالة جديدة لتتبع الإرسال


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
    
    // إذا كانت البيانات قد أرسلت بالفعل، لا تفعل شيئاً
    if (isSubmitted) {
      return;
    }
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
        setIsSubmitted(true); // تحديث حالة الإرسال
        formik.resetForm(); // إعادة تعيين النموذج
        
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
    if (!isSubmitted) { // لا تسمح بإضافة علف إذا تم الإرسال
      formik.setFieldValue('feeds', [...formik.values.feeds, { feedId: '', quantity: '' }]);
    }
  };

  const handleFeedChange = (index, field, value) => {
    if (!isSubmitted) { // لا تسمح بتعديل البيانات إذا تم الإرسال
      const newFeeds = [...formik.values.feeds];
      newFeeds[index][field] = field === 'quantity' ? Number(value) : value;
      formik.setFieldValue('feeds', newFeeds);
    }
  };

   // دالة لإعادة تعيين النموذج والسماح بإدخال جديد
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
    <div className="container">
      <div className="title2">{t('fodderTitle')}</div>
      <p className="text-danger">{error}</p>
      {isSubmitted && (
        <div className="alert alert-success mt-3">
          {t('fodderAddedSuccessfully')}
        </div>
      )}

      <form onSubmit={formik.handleSubmit}>
        {isLoading ? (
          <button type="submit" className="btn button2" disabled>
            <i className="fas fa-spinner fa-spin"></i>
          </button>
        ) : (
          <button type="submit" className="btn button2" disabled={isLoading || isSubmitted || !formik.isValid}>
            <IoIosSave /> {t('save')}
          </button>
        )}

        <div className="animaldata">
          <div className="input-box">
            <label className="label" htmlFor="name">
              {t('foddernames')}
            </label>
            <input
              {...formik.getFieldProps('name')}
              placeholder={t('enterFeedName')}
              id="name"
              type="text"
              className="input2"
              disabled={isSubmitted}

            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-danger">{formik.errors.name}</p>
            )}
          </div>

          {formik.values.feeds.map((feed, index) => (
            <div key={index} className="input-box">
              <label className="label" htmlFor={`feeds[${index}].feedId`}>
                {t('feedName')}
              </label>
              <select
                id={`feeds[${index}].feedId`}
                name={`feeds[${index}].feedId`}
                className="input2"
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
              {formik.errors.feeds && formik.touched.feeds && (
                <p className="text-danger">{formik.errors.feeds}</p>
              )}

              <label className="label" htmlFor={`feeds[${index}].quantity`}>
                {t('quantity')}
              </label>
              <input
                type="number"
                id={`feeds[${index}].quantity`}
                name={`feeds[${index}].quantity`}
                className="input2"
                value={feed.quantity}
                onChange={(e) => handleFeedChange(index, 'quantity', e.target.value)}
                onBlur={formik.handleBlur}
                placeholder={t('enterQuantity')}
                disabled={isSubmitted}

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
