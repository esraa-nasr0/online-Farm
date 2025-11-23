import axios from 'axios';
import React from 'react';

function DownloadMatExcel() {
    
// Helper function to generate headers with the latest token
const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
  
    // Ensure the token has only one "Bearer" prefix
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
  
    return {
        Authorization: formattedToken
    };
  };

    const handleDownload = async () => {
        const headers = getHeaders(); // Get the latest headers
        try {
            const response = await axios.get(
                'https://api.mazraaonline.com/api/mating/exportMatingToExcel', 
                { headers, responseType: 'blob' }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'mating.xlsx'); // Filename for the download
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

export default DownloadMatExcel;
