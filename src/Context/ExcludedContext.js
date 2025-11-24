import axiosInstance from "../api/axios";
import { createContext } from "react";

export let ExcludedContext = createContext();

function getExcluted(page, limit, filters = {}) {
    return axiosInstance.get(`/excluded/getallexcludeds`, {
        params: {
            page,
            limit,
            ...filters
        }
    })
    .then((response) => response)
    .catch((err) => {
        console.error("Error fetching excluded data:", err);
        throw err; 
    });
}


export function deleteExcluted(id) {
    return axiosInstance.delete(`/excluded/deleteexcluded/${id}`)
        .then((response) => response)
        .catch((err) => {
            console.error("Error deleting excluded data:", err);
            throw err;
        });
}

export default function ExcludedContextProvider(props) {
    return (
        <ExcludedContext.Provider value={{ getExcluted, deleteExcluted }}>
            {props.children}
        </ExcludedContext.Provider>
    );
}
