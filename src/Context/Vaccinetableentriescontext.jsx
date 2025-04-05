import React from 'react';
import axios from 'axios';

const Vaccinetableentriescontext = React.createContext();

const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');

  
    const formattedToken = Authorization?.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;

    return {
        Authorization: formattedToken
    };
};

async function getallVaccineanimalEntries(page, limit, filters = {}) {
    try {
        const headers = getHeaders(); 
        const response = await axios.get('https://farm-project-bbzj.onrender.com/api/vaccine/getAllVaccineEntries', {
            headers,
            params: {
                page,
                limit,
                ...filters
            },
        });
        return response.data;
    } catch (err) {
        console.error("Error fetching vaccines:", err.response ? err.response.data : err.message);
        throw err;
    }
}

async function DeletVaccineanimal(id) {
    try {
        const headers = getHeaders(); // Get the latest headers
        const response = await axios.delete(`https://farm-project-bbzj.onrender.com/api/vaccine/DeleteVaccineEntry/${id}`, { headers });
        return response.data;
    } catch (err) {
        console.error("Error deleting vaccine:", err.response ? err.response.data : err.message);
        throw err;
    }
}

export default function VaccinetableentriescontextProvider(props) {
    return (
        <Vaccinetableentriescontext.Provider value={{ getallVaccineanimalEntries, DeletVaccineanimal }}>
            {props.children}
        </Vaccinetableentriescontext.Provider>
    );
}

export { Vaccinetableentriescontext };
