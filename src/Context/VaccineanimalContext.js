import React from 'react';
import axios from 'axios';

const VaccineanimalContext = React.createContext();

// Helper function to generate headers with the latest token
const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');

    // Ensure the token has only one "Bearer" prefix
    const formattedToken = Authorization?.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;

    return {
        Authorization: formattedToken
    };
};

function getVaccineMenue() {
    const headers = getHeaders(); 
    return axios
        .get(`https://api.mazraaonline.com/api/vaccine/GetVaccine-menue`, { headers })
        .then((response) => response)
        .catch((err) => err);
}

async function getallVaccineanimal(page, limit, filters = {}) {
    try {
        const headers = getHeaders(); // Get the latest headers
        const response = await axios.get('https://api.mazraaonline.com/api/vaccine/GetAllVaccine', {
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
        const response = await axios.delete(`https://api.mazraaonline.com/api/vaccine/DeleteVaccine/${id}`, { headers });
        return response.data;
    } catch (err) {
        console.error("Error deleting vaccine:", err.response ? err.response.data : err.message);
        throw err;
    }
}

export default function VaccineanimalContextProvider(props) {
    return (
        <VaccineanimalContext.Provider value={{ getallVaccineanimal, DeletVaccineanimal ,getVaccineMenue}}>
            {props.children}
        </VaccineanimalContext.Provider>
    );
}

export { VaccineanimalContext };
