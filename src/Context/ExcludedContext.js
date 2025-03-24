import axios from "axios";
import { createContext } from "react";

// Creating the ExclutedContext
export let ExcludedContext = createContext();

// Helper function to generate headers with the latest token
const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
  
    // Ensure the token has only one "Bearer" prefix
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
  
    return {
        Authorization: formattedToken
    };
  };

// Function to get excluded records
function getExcluted(page, limit, filters = {}) {
    const headers = getHeaders(); // Get the latest headers

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
    const headers = getHeaders(); // Get the latest headers

    return axios.delete(`https://farm-project-bbzj.onrender.com/api/excluded/deleteexcluded/${id}`, { headers })
        .then((response) => response)
        .catch((err) => {
            console.error("Error deleting excluded data:", err);
            throw err; // Rethrow the error after logging it
        });
}

// Context provider component to wrap the app and provide context values
export default function ExcludedContextProvider(props) {
    return (
        <ExcludedContext.Provider value={{ getExcluted, deleteExcluted }}>
            {props.children}
        </ExcludedContext.Provider>
    );
}
