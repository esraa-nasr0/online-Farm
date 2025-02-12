import axios from "axios";
import { createContext } from "react";

// Creating the ExclutedContext
export let ExclutedContext = createContext();

const Authorization = localStorage.getItem('Authorization');

// Set the Authorization header
const headers = {
    Authorization: `Bearer ${Authorization}`
};

// Function to get excluded records
function getExcluted(page, limit, filters = {}) {
    return axios.get(`https://farm-project-bbzj.onrender.com/api/excluded/getallexcludeds`, {
        params: {
            page,
            limit,
            ...filters
        },
        headers
    })
    .then((response) => response)
    .catch((err) => {
        console.error("Error fetching excluded data:", err);
        throw err; // Rethrow the error after logging it
    });
}

// Function to delete an excluded record
export function deleteExcluted(id) {
    return axios.delete(`https://farm-project-bbzj.onrender.com/api/excluded/deleteexcluded/${id}`, { headers })
        .then((response) => response)
        .catch((err) => {
            console.error("Error deleting excluded data:", err);
            throw err; // Rethrow the error after logging it
        });
}

// Context provider component to wrap the app and provide context values
export default function ExclutedContextProvider(props) {
    return (
        <ExclutedContext.Provider value={{ getExcluted, deleteExcluted }}>
            {props.children}
        </ExclutedContext.Provider>
    );
}
