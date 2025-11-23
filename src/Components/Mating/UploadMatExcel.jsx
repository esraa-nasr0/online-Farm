import axios from 'axios';  
import React, { useState } from "react";  
import * as XLSX from "xlsx";  
import DownloadMatExcel from './DownloadMatExcel';

function UploadMatExcel({ addMatingData }) {  
    const [data, setData] = useState([]);  

    
// Helper function to generate headers with the latest token
const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
  
    // Ensure the token has only one "Bearer" prefix
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
  
    return {
        Authorization: formattedToken
    };
  };
    
    const handleFileChange = (e) => {  
        const file = e.target.files[0];  
        if (file) {  
            const reader = new FileReader();  
            reader.onload = (event) => {  
                const wb = XLSX.read(event.target.result, { type: 'binary' });  
                const ws = wb.Sheets[wb.SheetNames[0]];  
                const jsonData = XLSX.utils.sheet_to_json(ws);  

                const formattedData = jsonData.map(item => ({  
                    tagId: String(item.tagId),  
                    maleTagId: item.maleTagId,  
                    matingType: item.matingType,  
                    matingDate: item.matingDate,  
                    sonarDate: item.sonarDate,  
                    sonarResult: item.sonarResult,  
                    expectedDeliveryDate: item.expectedDeliveryDate  
                }));  

                setData(formattedData);  
                uploadSheet(formattedData);  
            };  
            reader.readAsBinaryString(file);  
        }  
    };  

    async function uploadSheet(dataToUpload) {
        const headers = getHeaders(); // Get the latest headers
        const successfulUploads = [];
    
        for (let item of dataToUpload) {
            try {
                // Handle `matingDate`
                if (item.matingDate) {
                    const matingDateObj = new Date(item.matingDate);
                    item.matingDate = !isNaN(matingDateObj) ? matingDateObj.toISOString() : null;
                }
                // Handle `sonarDate`
                if (item.sonarDate) {
                    const sonarDateObj = new Date(item.sonarDate);
                    item.sonarDate = !isNaN(sonarDateObj) ? sonarDateObj.toISOString() : null;
                }
                // Handle `expectedDeliveryDate`
                if (item.expectedDeliveryDate) {
                    const expectedDeliveryDateObj = new Date(item.expectedDeliveryDate);
                    item.sonarDate = !isNaN(expectedDeliveryDateObj) ? expectedDeliveryDateObj.toISOString() : null;
                }
                const response = await axios.post(
                    'https://api.mazraaonline.com/api/mating/import',
                    item,
                    { headers: { ...headers, 'Content-Type': 'application/json' } }
                );
                if (response.data.status === 'success') {
                    successfulUploads.push(item);
                }
            } catch (err) {
                if (err.response) {
                    console.error("Upload error:", err.response.data);
                    if (err.response.data.message.includes("duplicate key error")) {
                        console.log(`Duplicate entry skipped for tagId: ${item.tagId}`);
                    } else {
                        console.log(`Error for tagId: ${item.tagId}`, err.response.data);
                    }
                } else {
                    console.error("Request error:", err.message);
                }
            }
        }
    
        addMatingData(successfulUploads);
    }

    const handleButtonClick = () => {
        document.getElementById('fileInput').click();
    };
    
    return ( 
        <div className=" d-flex align-items-center mt-3">
            <input 
                id="fileInput" 
                type="file" 
                accept=".xlsx, .xls" 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
            />
            <button 
                className="btn btn-lg me-3" 
                onClick={handleButtonClick} 
                style={{ backgroundColor: "#30c66a" ,  color: "white", border: 'none', borderRadius: '5px' }}
            >
                Upload Excel Sheet
            </button>
            <DownloadMatExcel/>
        </div>
    );  
}  

export default UploadMatExcel;
