import React, { useState } from 'react';
import axiosInstance from '../../api/axios';
import { useTranslation } from 'react-i18next';

function ReportDaily() {
    const [animalType, setAnimalType] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [reportData, setReportData] = useState(null);
    const { t } = useTranslation();

    async function getReport(animalType) {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await axiosInstance.get(`/report/daily`, {
                params: { animalType }
            });
            
            if (data.status === "success") {
                setReportData(data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || t('error_occurred'));
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!animalType) {
            setError(t('select_animal_type_required'));
            return;
        }
        getReport(animalType);
    };

    return (
        <div className="container">
            <div className="title2">{t('daily_report')}</div>
            <div className="form1-container">
                <form onSubmit={handleSubmit}>
                    <button type="submit" className="btn btn-secondary button2">
                        {t('get_report')}
                    </button>
                    <div className="animaldata">
                        <div className="input-box">
                            <label className="label">{t('animal_type')}:</label>
                            <select 
                                className="input2" 
                                value={animalType} 
                                onChange={(e) => setAnimalType(e.target.value)}
                            >
                                <option value="">{t('select_animal_type')}</option>
                                <option value="goat">{t('goat')}</option>
                                <option value="sheep">{t('sheep')}</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>

            {isLoading && <p>{t('loading')}...</p>}
            {error && <p className="text-danger">{error}</p>}

            {reportData && (
                <div className="form1-container">
                    <div className="summary">
                        <h3 className="summary-item total-animal">
                            {t('report_date')}: {new Date().toLocaleDateString()}
                        </h3>
                        <p className="summary-item total-birth-males">
                            {t('total_vaccines')}: {reportData.vaccineLogCount}
                        </p>
                        <p className="summary-item total-birth-females">
                            {t('total_weights')}: {reportData.weightCount}
                        </p>
                        <p className="summary-item pregnant">
                            {t('total_mating_events')}: {reportData.matingCount}
                        </p>
                        <p className="summary-item breeder">
                            {t('total_breeding_events')}: {reportData.breedingCount}
                        </p>
                        <p className="summary-item total-birth-entries">
                            {t('total_birth_entries')}: {reportData.totalBirthEntries}
                        </p>
                        <p className="summary-item male">
                            {t('total_males')}: {reportData.totalMales}
                        </p>
                        <p className="summary-item female">
                            {t('total_females')}: {reportData.totalFemales}
                        </p>
                        <p className="summary-item total-excluded">
                            {t('total_weanings')}: {reportData.totalWeanings}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReportDaily;