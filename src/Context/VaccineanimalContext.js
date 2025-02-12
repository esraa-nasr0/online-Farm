import React from 'react';
import axios from 'axios';

const VaccineanimalContext = React.createContext();

async function getallVaccineanimal(filters = {}) {
    const Authorization = localStorage.getItem('Authorization');
    
    if (!Authorization) {
        throw new Error("Authorization token not found");
    }

    const headers = {
        Authorization: `Bearer ${Authorization}`,
    };

    try {
        const response = await axios.get('https://farm-project-bbzj.onrender.com/api/vaccine/GetAllVaccine', {
            headers,
            params: filters
        });
        return response.data;
    } catch (err) {
        console.error("Error fetching vaccines:", err.response ? err.response.data : err.message);
        throw err;
    }
}

async function DeletVaccineanimal(id) {
    const Authorization = localStorage.getItem('Authorization');
    
    if (!Authorization) {
        throw new Error("Authorization token not found");
    }

    const headers = {
        Authorization: `Bearer ${Authorization}`,
    };

    try {
        const response = await axios.delete(`https://farm-project-bbzj.onrender.com/api/vaccine/DeleteVaccine/${id}`, { headers });
        return response.data;
    } catch (err) {
        console.error("Error deleting vaccine:", err.response ? err.response.data : err.message);
        throw err;
    }
}

export default function VaccineanimalContextProvider(props) {
    return (
        <VaccineanimalContext.Provider value={{ getallVaccineanimal, DeletVaccineanimal }}>
            {props.children}
        </VaccineanimalContext.Provider>
    );
}

export { VaccineanimalContext };