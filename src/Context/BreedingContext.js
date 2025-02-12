import axios from "axios";
import { createContext, useContext } from "react";

// Create a new context
export const BreedingContext = createContext();

// Function to get the Authorization header dynamically
const getAuthorizationHeader = () => {
    const Authorization = localStorage.getItem('Authorization');
    return Authorization ? { Authorization: `Bearer ${Authorization}` } : {};
};

// Function to get all breeding entries with pagination and optional filters
function getAllBreeding(page, limit, filters = {}) {
    return axios.get('https://farm-project-bbzj.onrender.com/api/breeding/GetAllBreeding', {
        params: {
            page,
            limit,
            ...filters,
        },
        headers: getAuthorizationHeader(),  // Dynamically get the Authorization header
    })
    .then((response) => response.data)  // Return only the response data
    .catch((err) => {
        console.error('Error fetching breeding data:', err);  // Improved error handling
        throw err;  // Throwing the error for the component to handle
    });
}

// Function to delete a breeding entry by ID
export function deleteBreeding(id) {
    return axios.delete(`https://farm-project-bbzj.onrender.com/api/breeding/DeleteBreeding/${id}`, { 
        headers: getAuthorizationHeader(),  // Dynamically get the Authorization header
    })
        .then((response) => response.data)  // Return only the response data
        .catch((err) => {
            console.error(`Error deleting breeding entry with ID ${id}:`, err);  // Improved error handling
            throw err;  // Throwing the error for the component to handle
        });
}

export default function BreedingContextProvider(props) {
    return (
        <BreedingContext.Provider value={{ getAllBreeding, deleteBreeding }}>
            {props.children}
        </BreedingContext.Provider>
    );
}
