import React, { useState } from 'react';
import axios from 'axios';

function ReportDaily() {
    const [animalType, setAnimalType] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [reportData, setReportData] = useState(null); // Holds the response data

    const Authorization = localStorage.getItem('Authorization');
    const headers = {
        Authorization: `Bearer ${Authorization}`,
    };

    async function getReport(animalType) {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await axios.get(`https://farm-project-bbzj.onrender.com/api/report/daily`, {
                params: { animalType },
                headers
            });
            
            console.log("Animal type sent:", animalType);
            
            if (data.status === "success") {
                setIsLoading(false);
                setReportData(data.data);
                console.log(data);
            }
        } catch (err) {
            setIsLoading(false);
            setError(err.response?.data?.message || "An error occurred");
            console.log(err.response?.data || err.message);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!animalType) {
            setError("Please select an animal type");
            return;
        }

        console.log("Parameters sent to API:", { animalType });
        getReport(animalType); // Pass animalType to getReport
    };

    return (
        <div className="container">
            <div className="title2">Daliy Report</div>
            <div className="form1-container">
                <form onSubmit={handleSubmit}>
                <button type="submit" className="btn btn-secondary button2">Get Report</button>
                    <div className="animaldata">
                        <div className="input-box">
                            <label className="label">Animal Type:</label>
                            <select className="input2" value={animalType} onChange={(e) => setAnimalType(e.target.value)}>
                                <option value="">Select Animal Type</option>
                                <option value="goat">Goat</option>
                                <option value="sheep">Sheep</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>

            {isLoading && <p>Loading...</p>}
            {error && <p className="text-danger">{error}</p>}

                {reportData && (
                <div className="form1-container">
                <div className="summary">
                    <h3 className="summary-item total-animal">Report Date: {new Date().toLocaleDateString()}</h3>
                    <p className="summary-item total-birth-males">Total Vaccine : {reportData.vaccineLogCount}</p>
                    <p className="summary-item total-birth-females">Total Weights : {reportData.weightCount}</p>
                    <p className="summary-item  pregnant">Total Mating Events: {reportData.matingCount}</p>
                    <p className="summary-item breeder">Total Breeding Events: {reportData.breedingCount}</p>
                    <p className="summary-item total-birth-entries">Total Birth Entries: {reportData.totalBirthEntries}</p>
                    <p className="summary-item male">Total Males: {reportData.totalMales}</p>
                    <p className="summary-item female">Total Females: {reportData.totalFemales}</p>
                    <p className="summary-item total-excluded">Total Weanings: {reportData.totalWeanings}</p>
                </div>
                </div>
                )}
        </div>
    );
}

export default ReportDaily;
