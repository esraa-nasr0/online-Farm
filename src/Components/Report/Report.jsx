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
import { jwtDecode } from 'jwt-decode';

ChartJS.register(ArcElement, Tooltip, Legend);

function Report() {
    const { t, i18n } = useTranslation();
    const [animalType, setAnimalType] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isFattening, setIsFattening] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('Authorization');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setIsFattening(decoded.registerationType === 'fattening');
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    const getHeaders = () => {
        const Authorization = localStorage.getItem('Authorization');
        if (!Authorization) {
            throw new Error('No authorization token found');
        }
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
                setError(data.message || t('error.unexpectedResponse'));
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 
                              err.message || 
                              t('fetch_report_error');
            setError(errorMessage);
            console.error('Fetch report error:', err);
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

    const handleDownloadPDF = async () => {
        if (!animalType || !dateFrom || !dateTo) {
            setError(t('required_fields_error'));
            return;
        }

        setIsDownloading(true);
        setError(null);
        
        try {
            const headers = getHeaders();
            
            console.log('Request params:', {
                animalType,
                dateFrom,
                dateTo,
                lang: i18n.language
            });

            const response = await axios.get('https://farm-project-bbzj.onrender.com/api/report/download', {
                params: {
                    animalType,
                    dateFrom,
                    dateTo,
                    lang: i18n.language
                },
                headers,
                responseType: 'blob'
            });

            if (response.status !== 200) {
                throw new Error(`Server responded with status ${response.status}`);
            }

            // Check if the response is actually a PDF
            const contentType = response.headers['content-type'];
            if (!contentType || !contentType.includes('application/pdf')) {
                // Try to read the response as text if it's not a PDF
                const text = await response.data.text();
                try {
                    const json = JSON.parse(text);
                    throw new Error(json.message || 'Invalid response format');
                } catch {
                    throw new Error('Server returned non-PDF response');
                }
            }

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `report-${animalType}-${dateFrom}-${dateTo}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error('Download error:', err);
            
            let errorMessage = t('download_error');
            if (err.response) {
                // Try to extract error message from response
                if (err.response.data instanceof Blob) {
                    try {
                        const text = await err.response.data.text();
                        const json = JSON.parse(text);
                        errorMessage = json.message || errorMessage;
                    } catch {
                        errorMessage = 'Server error occurred';
                    }
                } else if (err.response.data?.message) {
                    errorMessage = err.response.data.message;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
        } finally {
            setIsDownloading(false);
        }
    };

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
            ...(isFattening ? [] : [t('pregnant')]),
            t('total_excluded'),
            ...(isFattening ? [] : [t('total_birth_males'), t('total_birth_females')])
        ],
        datasets: [
            {
                data: [
                    maleCount,
                    femaleCount,
                    ...(isFattening ? [] : [breederCount]),
                    totalExcluded,
                    ...(isFattening ? [] : [totalMales, totalFemales])
                ],
                backgroundColor: [
                    '#f3f395',
                    '#fce5a5',
                    ...(isFattening ? [] : ['#41e1a9']),
                    '#e70505',
                    ...(isFattening ? [] : ['#4169E1', '#81a9d1'])
                ],
            },
        ],
    };

    return (
        <div className="container">
            <div className={style.title}>{t('report')}</div>
            
            {error && (
                <div className={style.errorAlert}>
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className={style.buttonGroup}>
                    <button 
                        type="submit" 
                        className={style.button}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span>{t('loading')}...</span>
                        ) : (
                            <span>{t('get_report')}</span>
                        )}
                    </button>
                    {reportData && (
                        <button 
                            type="button" 
                            className={`${style.button} ${style.downloadButton}`}
                            onClick={handleDownloadPDF}
                            disabled={isDownloading}
                        >
                            {isDownloading ? (
                                <span>{t('downloading')}...</span>
                            ) : (
                                <>
                                    <i className="fas fa-file-arrow-down me-1"></i>
                                    {t('download_pdf')}
                                </>
                            )}
                        </button>
                    )}
                </div>
                <div className={style.animalData}>
                    <div className={style.inputBox}>
                        <label className={style.label}>{t('animal_type')}:</label>
                        <select 
                            className={style.input} 
                            value={animalType} 
                            onChange={(e) => setAnimalType(e.target.value)}
                            required
                        >
                            <option value="">{t('select_animal_type')}</option>
                            <option value="goat">{t('goat')}</option>
                            <option value="sheep">{t('sheep')}</option>
                        </select>
                    </div>
                    <div className={style.inputBox}>
                        <label className={style.label}>{t('date_from')}:</label>
                        <input 
                            type="date" 
                            className={style.input} 
                            value={dateFrom} 
                            onChange={(e) => setDateFrom(e.target.value)} 
                            required
                        />
                    </div>
                    <div className={style.inputBox}>
                        <label className={style.label}>{t('date_to')}:</label>
                        <input 
                            type="date" 
                            className={style.input} 
                            value={dateTo} 
                            onChange={(e) => setDateTo(e.target.value)} 
                            required
                        />
                    </div>
                </div>
            </form>

            {isLoading && (
                <div className={style.loadingOverlay}>
                    <div className={style.spinner}></div>
                    <p>{t('loading_report')}</p>
                </div>
            )}

            {reportData && (
                <div className={style.reportGrid}>
                    <div className={style.pieCard}>
                        <h2 className={style.sectionTitle}>{t('current_status')}</h2>
                        <Pie data={pieData} />
                    </div>

                    <div className={style.card}>
                        <h3 className={style.sectionTitle}>{t('summary')}</h3>
                        <div className={style.summaryItem}>
                            <div className={`${style.colorDot} ${style.animal}`}></div>
                            <p>{t('total_animals')}: {totalAnimals}</p>
                        </div>
                        <div className={style.summaryItem}>
                            <div className={`${style.colorDot} ${style.male}`}></div>
                            <p>{t('male')}: {maleCount}</p>
                        </div>
                        <div className={style.summaryItem}>
                            <div className={`${style.colorDot} ${style.female}`}></div>
                            <p>{t('female')}: {femaleCount}</p>
                        </div>
                        {!isFattening && (
                            <>
                                <div className={style.summaryItem}>
                                    <div className={`${style.colorDot} ${style.pregnant}`}></div>
                                    <p>{t('pregnant')}: {breederCount}</p>
                                </div>
                                <div className={style.summaryItem}>
                                    <div className={`${style.colorDot} ${style.animal}`}></div>
                                    <p>{t('total_birth_entries')}: {totalBirthEntries}</p>
                                </div>
                                <div className={style.summaryItem}>
                                    <div className={`${style.colorDot} ${style.birthMales}`}></div>
                                    <p>{t('total_birth_males')}: {totalMales}</p>
                                </div>
                                <div className={style.summaryItem}>
                                    <div className={`${style.colorDot} ${style.birthFemales}`}></div>
                                    <p>{t('total_birth_females')}: {totalFemales}</p>
                                </div>
                            </>
                        )}
                        <div className={style.summaryItem}>
                            <div className={`${style.colorDot} ${style.excluded}`}></div>
                            <p>{t('total_excluded')}: {totalExcluded}</p>
                        </div>
                        <div className={style.summaryItem}>
                            <div className={`${style.colorDot} ${style.excluded}`}></div>
                            <p>{t('excluded_sweep')}: {excludedSweep}</p>
                        </div>
                        <div className={style.summaryItem}>
                            <div className={`${style.colorDot} ${style.excluded}`}></div>
                            <p>{t('excluded_death')}: {excludedDeath}</p>
                        </div>
                        <div className={style.summaryItem}>
                            <div className={`${style.colorDot} ${style.excluded}`}></div>
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

                    {/* Vaccine Consumption */}
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

                    {/* Remaining Vaccine Stock */}
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
                                        <td>{item.stock?.bottles || 0}</td>
                                        <td>{item.stock?.dosesPerBottle || 0}</td>
                                        <td>{item.stock?.totalDoses || 0}</td>
                                        <td>{item.pricing?.bottlePrice || 0}</td>
                                        <td>{item.pricing?.dosePrice || 0}</td>
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