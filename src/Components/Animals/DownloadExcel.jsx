import axiosInstance from '../../api/axios';
import React from 'react';
import { getToken } from '../../utils/authToken';

function DownloadExcel() {
    
// Helper to ensure token exists
const hasToken = () => !!getToken();
    
    const handleDownload = async () => {
        if (!hasToken()) return;
        try {
            const response = await axiosInstance.get(
                '/animal/exportAnimalsToExcel', 
                { responseType: 'blob' }
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
