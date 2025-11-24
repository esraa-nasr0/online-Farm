import React from 'react';
import axiosInstance from '../api/axios';

const VaccineanimalContext = React.createContext();

function getVaccineMenue() {
    return axiosInstance
        .get(`/vaccine/GetVaccine-menue`)
        .then((response) => response)
        .catch((err) => err);
}

async function getallVaccineanimal(page, limit, filters = {}) {
    try {
        const response = await axiosInstance.get('/vaccine/GetAllVaccine', {
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
        const response = await axiosInstance.delete(`/vaccine/DeleteVaccine/${id}`);
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
