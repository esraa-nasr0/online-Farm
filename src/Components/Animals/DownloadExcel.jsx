import axios from 'axios';
import React from 'react';

function DownloadExcel() {
    const Authorization = localStorage.getItem('Authorization');
    const headers = {  
        Authorization: `Bearer ${Authorization}`
    };

    const handleDownload = async () => {
        try {
            const response = await axios.get(
                'https://farm-project-bbzj.onrender.com/api/animal/exportAnimalsToExcel', 
                { headers, responseType: 'blob' }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'animals.xlsx'); // Filename for the download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading the Excel file", error);
        }
    };

    return (
        <div>
            <button
            className="btn btn-lg"
            style={{ backgroundColor: "#ef791f" ,  color: "white"}}
            onClick={handleDownload}>Download Excel Sheet</button>
        </div>
    );
}

export default DownloadExcel;
