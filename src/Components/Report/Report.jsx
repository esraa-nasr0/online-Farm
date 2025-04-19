import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import style from "./Report.module.css";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { useTranslation } from 'react-i18next';

ChartJS.register(ArcElement, Tooltip, Legend);

function Report() {
    const { t } = useTranslation();
    const [animalType, setAnimalType] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return { Authorization: formattedToken };
    };

    async function getReport() {
        const headers = getHeaders();
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get('https://farm-project-bbzj.onrender.com/api/filter/report', {
                params: { animalType, dateFrom, dateTo },
                headers,
            });
            const { data } = response;
            if (data.status === 'success') {
                setReportData(data.data);
            } else {
                setError(t('error.unexpectedResponse'));
            }
        } catch (err) {
            setError(err.response?.data?.message || t('fetch_report_error'));
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!animalType || !dateFrom || !dateTo) {
            setError(t('required_fields_error'));
            return;
        }
        getReport();
    };

    useEffect(() => {}, [reportData]);

    const animalReport = reportData?.animalReport || [];
    const birthEntries = reportData?.birthEntries || {};
    const excludedReport = reportData?.excludedReport || [];
    const feedConsumption = reportData?.feedConsumption || [];
    const remainingFeedStock = reportData?.remainingFeedStock || [];
    const treatmentConsumption = reportData?.treatmentConsumption || [];
    const remainingTreatmentStock = reportData?.remainingTreatmentStock || [];
    const vaccineConsumption = reportData?.vaccineConsumption || [];
    const remainingVaccineStock = reportData?.remainingVaccineStock || [];
    
    const totalAnimals = animalReport.reduce((acc, animal) => acc + animal.count, 0);
    const maleCount = animalReport.filter((animal) => animal.gender === 'male').reduce((acc, animal) => acc + animal.count, 0);
    const femaleCount = animalReport.filter((animal) => animal.gender === 'female').reduce((acc, animal) => acc + animal.count, 0);
    const breederCount = reportData?.pregnantAnimal || 0;

    const totalBirthEntries = birthEntries.totalBirthEntries || 0;
    const totalMales = birthEntries.totalMales || 0;
    const totalFemales = birthEntries.totalFemales || 0;

    const excludedSweep = excludedReport.filter((report) => report.excludedType === 'sweep').reduce((acc, report) => acc + report.count, 0);
    const excludedDeath = excludedReport.filter((report) => report.excludedType === 'death').reduce((acc, report) => acc + report.count, 0);
    const excludedSale = excludedReport.filter((report) => report.excludedType === 'sale').reduce((acc, report) => acc + report.count, 0);
    const totalExcluded = excludedSweep + excludedDeath + excludedSale;

    const pieData = {
        labels: [
            t('male'),
            t('female'),
            t('pregnant'),
            t('total_excluded'),
            t('total_birth_males'),
            t('total_birth_females')
        ],
        datasets: [
            {
                data: [maleCount, femaleCount, breederCount, totalExcluded, totalMales, totalFemales],
                backgroundColor: ['#f3f395', '#fce5a5', '#41e1a9', '#e70505', '#4169E1', '#81a9d1'],
            },
        ],
    };

    return (
        <div className="container">
            <div className={style.title}>{t('report')}</div>
            <form onSubmit={handleSubmit}>
                <button type="submit" className={style.button}>{t('get_report')}</button>
                <div className={style.animalData}>
                    <div className={style.inputBox}>
                        <label className={style.label}>{t('animal_type')}:</label>
                        <select className={style.input} value={animalType} onChange={(e) => setAnimalType(e.target.value)}>
                            <option value="">{t('select_animal_type')}</option>
                            <option value="goat">{t('goat')}</option>
                            <option value="sheep">{t('sheep')}</option>
                        </select>
                    </div>
                    <div className={style.inputBox}>
                        <label className={style.label}>{t('date_from')}:</label>
                        <input type="date" className={style.input} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                    </div>
                    <div className={style.inputBox}>
                        <label className={style.label}>{t('date_to')}:</label>
                        <input type="date" className={style.input} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                    </div>
                </div>
            </form>

            {reportData && (
                <div className={style.reportGrid}>
                    <div className={style.pieCard}>
                        <h2 className={style.sectionTitle}>{t('current_status')}</h2>
                        <Pie data={pieData}  />
                    </div>

                    <div className={style.card}>
                        <h3 className={style.sectionTitle}>{t('summary')}</h3>
                        <div className={style.summaryItem}>
                            <div className={style.colorDot + " " + style.animal}></div>
                            <p>{t('total_animals')}: {totalAnimals}</p>
                        </div>
                        <div className={style.summaryItem}>
                            <div className={style.colorDot + " " + style.male}></div>
                            <p>{t('male')}: {maleCount}</p>
                        </div>
                        <div className={style.summaryItem}>
                            <div className={style.colorDot + " " + style.female}></div>
                            <p>{t('female')}: {femaleCount}</p>
                        </div>
                        <div className={style.summaryItem}>
                            <div className={style.colorDot + " " + style.pregnant}></div>
                            <p>{t('pregnant')}: {breederCount}</p>
                        </div>
                        <div className={style.summaryItem}>
                            <div className={style.colorDot + " " + style.animal}></div>
                            <p>{t('total_birth_entries')}: {totalBirthEntries}</p>
                        </div>
                        <div className={style.summaryItem}>
                            <div className={style.colorDot + " " + style.birthMales}></div>
                            <p>{t('total_birth_males')}: {totalMales}</p>
                        </div>
                        <div className={style.summaryItem}>
                            <div className={style.colorDot + " " + style.birthFemales}></div>
                            <p>{t('total_birth_females')}: {totalFemales}</p>
                        </div>
                        <div className={style.summaryItem}>
                            <div className={style.colorDot + " " + style.excluded}></div>
                            <p>{t('total_excluded')}: {totalExcluded}</p>
                        </div>
                        <div className={style.summaryItem}>
                            <div className={style.colorDot + " " + style.excluded}></div>
                            <p>{t('excluded_sweep')}: {excludedSweep}</p>
                        </div>
                        <div className={style.summaryItem}>
                            <div className={style.colorDot + " " + style.excluded}></div>
                            <p>{t('excluded_death')}: {excludedDeath}</p>
                        </div>
                        <div className={style.summaryItem}>
                            <div className={style.colorDot + " " + style.excluded}></div>
                            <p>{t('excluded_sale')}: {excludedSale}</p>
                        </div>
                    </div>

                    {/* Feed Consumption */}
                    <div className={style.card}>
                        <h3 className={style.sectionTitle}>{t('feed_consumed')}</h3>
                        <table className={style.table}>
                            <thead>
                                <tr>
                                    <th>{t('feed_name')}</th>
                                    <th>{t('total_consumed')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feedConsumption.map((feed, index) => (
                                    <tr key={index}>
                                        <td>{feed.feedName}</td>
                                        <td>{feed.totalConsumed}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Remaining Feed Stock */}
                    <div className={style.card}>
                        <h3 className={style.sectionTitle}>{t('remaining_feed_stock')}</h3>
                        <table className={style.table}>
                            <thead>
                                <tr>
                                    <th>{t('feed_name')}</th>
                                    <th>{t('quantity')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {remainingFeedStock.map((feed, index) => (
                                    <tr key={index}>
                                        <td>{feed.name}</td>
                                        <td>{feed.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Treatment */}
                    <div className={style.card}>
                        <h3 className={style.sectionTitle}>{t('treatment_consumption')}</h3>
                        <table className={style.table}>
                            <thead>
                                <tr>
                                    <th>{t('treatment_name')}</th>
                                    <th>{t('total_consumed')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {treatmentConsumption.map((treatment, index) => (
                                    <tr key={index}>
                                        <td>{treatment.treatmentName}</td>
                                        <td>{treatment.totalConsumed}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Remaining Treatment */}
                    <div className={style.card}>
                        <h3 className={style.sectionTitle}>{t('remaining_treatment_stock')}</h3>
                        <table className={style.table}>
                            <thead>
                                <tr>
                                    <th>{t('treatment_name')}</th>
                                    <th>{t('volume')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {remainingTreatmentStock.map((treatment, index) => (
                                    <tr key={index}>
                                        <td>{treatment.name}</td>
                                        <td>{treatment.volume}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className={style.card}>
    <h3 className={style.sectionTitle}>{t('vaccine_consumption')}</h3>
    <table className={style.table}>
        <thead>
            <tr>
                <th>{t('vaccine_name')}</th>
                <th>{t('total_consumed')}</th>
            </tr>
        </thead>
        <tbody>
            {vaccineConsumption.map((item, index) => (
                <tr key={index}>
                    <td>{item.vaccineName}</td>
                    <td>{item.totalConsumed}</td>
                </tr>
            ))}
        </tbody>
    </table>
</div>

<div className={style.card}>
    <h3 className={style.sectionTitle}>{t('remaining_vaccine_stock')}</h3>
    <table className={style.table}>
        <thead>
            <tr>
                <th>{t('vaccine_name')}</th>
                <th>{t('bottles')}</th>
                <th>{t('doses_per_bottle')}</th>
                <th>{t('total_doses')}</th>
                <th>{t('bottle_price')}</th>
                <th>{t('dose_price')}</th>
            </tr>
        </thead>
        <tbody>
            {remainingVaccineStock.map((item, index) => (
                <tr key={index}>
                    <td>{item.vaccineName}</td>
                    <td>{item.stock?.bottles}</td>
                    <td>{item.stock?.dosesPerBottle}</td>
                    <td>{item.stock?.totalDoses}</td>
                    <td>{item.pricing?.bottlePrice}</td>
                    <td>{item.pricing?.dosePrice}</td>
                </tr>
            ))}
        </tbody>
    </table>
</div>

                </div>
            )}
        </div>
    );
}

export default Report;
