import axios from "axios";
import { createContext } from "react";

export let BreedingContext = createContext();

// Helper function to generate headers with the latest token
const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
  
    // Ensure the token has only one "Bearer" prefix
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
  
    return {
        Authorization: formattedToken
    };
  };

// Function to get all breeding entries with pagination and optional filters
export function getAllBreeding(page, limit, filters = {}) {
    const headers = getHeaders(); // Get the latest headers

    return axios.get('https://farm-project-bbzj.onrender.com/api/breeding/GetAllBreeding', {
        params: {
            page,
            limit,
            ...filters
        },
        headers
    })
    .then((response) => response.data)
    .catch((err) => {
        console.error("Error fetching breeding data:", err);
        throw err;
    });
}

// Function to delete a breeding entry by ID
export function deleteBreeding(id) {
    const headers = getHeaders(); // Get the latest headers

    return axios.delete(`https://farm-project-bbzj.onrender.com/api/breeding/DeleteBreeding/${id}`, { headers })
        .then((response) => response.data)
        .catch((err) => {
            console.error("Error deleting breeding entry:", err);
            throw err;
        });
}

export default function BreedingContextProvider(props) {
    return (
        <BreedingContext.Provider value={{ getAllBreeding, deleteBreeding}}>
            {props.children}
        </BreedingContext.Provider>
    );
}
