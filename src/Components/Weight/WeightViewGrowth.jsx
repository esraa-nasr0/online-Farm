import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

function WeightViewGrowth() {
  const { t } = useTranslation();
  const { id } = useParams(); // نفترض أنك بتمرر ID من الـ URL

  const fetchAnimalGrowth = async () => {
    const token = localStorage.getItem('Authorization');
    const headers = {
      Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`
    };

    const response = await axios.get(
      `https://farm-project-bbzj.onrender.com/api/weight/getAnimalWithGrowthData/${id}`,
      { headers }
    );

    if (response.data.status !== 'success') {
      throw new Error(t('fetch_error'));
    }

    return response.data.data;
  };

  const { data, isError, error } = useQuery({
    queryKey: ['animalGrowth', id],
    queryFn: fetchAnimalGrowth,
    enabled: !!id
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  if (isError) {
    Swal.fire(t('error'), error.message || t('fetch_error'), 'error');
    return null;
  }

  const { animal, growthData } = data || {};

  return (
    <div className="mating-record-wrapper">
      <div className="mating-record-header">
        <h2>{t('growth_data_for')} {animal?.tagId}</h2>
      </div>

      <div className="mating-record-list">
        <div className="mating-record-item">
          <div className="mating-record-info">
            <span>{t('first_weight')}</span>
            <ul>
              <li><strong>{t('date')}:</strong> {formatDate(growthData?.firstWeight?.date)}</li>
              <li><strong>{t('weight')}:</strong> {growthData?.firstWeight?.weight} kg</li>
              <li><strong>{t('weight_type')}:</strong> {growthData?.firstWeight?.weightType}</li>
            </ul>
          </div>
        </div>

        <div className="mating-record-item">
          <div className="mating-record-info">
            <span>{t('last_weight')}</span>
            <ul>
              <li><strong>{t('date')}:</strong> {formatDate(growthData?.lastWeight?.date)}</li>
              <li><strong>{t('weight')}:</strong> {growthData?.lastWeight?.weight} kg</li>
              <li><strong>{t('weight_type')}:</strong> {growthData?.lastWeight?.weightType}</li>
              <li><strong>{t('adg')}:</strong> {growthData?.lastWeight?.ADG?.toFixed(2)} g/day</li>
              <li><strong>{t('conversion_efficiency')}:</strong> {growthData?.lastWeight?.conversionEfficiency?.toFixed(2)}</li>
            </ul>
          </div>
        </div>

        <div className="mating-record-item">
          <div className="mating-record-info">
            <span>{t('overall_growth')}</span>
            <ul>
              <li><strong>{t('weight_gain')}:</strong> {growthData?.overallGrowth?.totalWeightGain} kg</li>
              <li><strong>{t('growth_days')}:</strong> {growthData?.overallGrowth?.growthPeriodDays} {t('days')}</li>
              <li><strong>{t('adg')}:</strong> {growthData?.overallGrowth?.ADG?.toFixed(2)} g/day</li>
              <li><strong>{t('conversion_efficiency')}:</strong> {growthData?.overallGrowth?.conversionEfficiency?.toFixed(2)}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeightViewGrowth;
