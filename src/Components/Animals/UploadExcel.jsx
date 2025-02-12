import axios from 'axios';  
import React, { useState } from "react";  
import * as XLSX from "xlsx";  
import DownloadExcel from './DownloadExcel';

function UploadExcel({ addAnimals }) {  
    const [data, setData] = useState([]);  

    const Authorization = localStorage.getItem('Authorization');  
    const headers = {  
        Authorization: `Bearer ${Authorization}`
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
                    breed: item.breed,  
                    animalType: item.animalType,  
                    brithDate: item.brithDate,  
                    gender: item.gender,  
                    motherId: item.motherId,  
                    fatherId: item.fatherId,  
                    female_Condition: item.female_Condition,  
                    purchaseDate: item.purchaseDate,  
                    traderName: item.traderName,  
                    locationShed: item.locationShed  
                }));  

                setData(formattedData);  
                uploadSheet(formattedData);  
            };  
            reader.readAsBinaryString(file);  
        }  
    };  

    async function uploadSheet(dataToUpload) {
        const successfulUploads = [];
    
        for (let item of dataToUpload) {
            try {
                // Handle `brithDate`
                if (item.brithDate) {
                    const birthDateObj = new Date(item.brithDate);
                    item.brithDate = !isNaN(birthDateObj) ? birthDateObj.toISOString() : null;
                }
                // Handle `purchaseDate`
                if (item.purchaseDate) {
                    const purchaseDateObj = new Date(item.purchaseDate);
                    item.purchaseDate = !isNaN(purchaseDateObj) ? purchaseDateObj.toISOString() : null;
                }
                const response = await axios.post(
                    'https://farm-project-bbzj.onrender.com/api/animal/import',
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
    
        addAnimals(successfulUploads);
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
            <DownloadExcel/>
        </div>
    );  
}  

export default UploadExcel;
