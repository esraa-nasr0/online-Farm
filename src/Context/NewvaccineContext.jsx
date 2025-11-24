import axiosInstance from "../api/axios";
import { createContext } from "react";

export let NewvaccineContext = createContext();

function getVaccinename(page, limit, filters = {}) {
    return axiosInstance.get(`/vaccine-types`)
    .then((response) => response)
    .catch((err) => {
        console.error("Error fetching excluded data:", err);
        throw err; 
    });
}


export default function NewvaccineContextProvider(props) {
    return (
        <NewvaccineContext.Provider value={{ getVaccinename }}>
            {props.children}
        </NewvaccineContext.Provider>
    );
}