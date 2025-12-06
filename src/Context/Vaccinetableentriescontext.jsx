import React from 'react';
import axiosInstance from '../api/axios';

const Vaccinetableentriescontext = React.createContext();

async function getallVaccineanimalEntries(page, limit, filters = {}) {
    try {
        const response = await axiosInstance.get('/vaccine/getAllVaccineEntries', {
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
        const response = await axiosInstance.delete(`/vaccine/DeleteVaccineEntry/${id}`);
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
