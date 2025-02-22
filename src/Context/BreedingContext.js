import axios from "axios";
import { createContext, useContext } from "react";

// Create a new context
export const BreedingContext = createContext();

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
function getAllBreeding(page, limit, filters = {}) {
    return axios.get('https://farm-project-bbzj.onrender.com/api/breeding/GetAllBreeding', {
        params: { page, limit, ...filters },
        headers: getHeaders(),  // Use the correct function
    })
    .then((response) => response.data)  // Return only the response data
    .catch((err) => {
        console.error('Error fetching breeding data:', err);
        throw err;  
    });
}

// Function to delete a breeding entry by ID
export function deleteBreeding(id) {
    return axios.delete(`https://farm-project-bbzj.onrender.com/api/breeding/DeleteBreeding/${id}`, { 
        headers: getHeaders(),  // Use the correct function
    })
    .then((response) => response.data)  // Return only the response data
    .catch((err) => {
        console.error(`Error deleting breeding entry with ID ${id}:`, err);
        throw err;
    });
}

export default function BreedingContextProvider({ children }) {
    return (
        <BreedingContext.Provider value={{ getAllBreeding, deleteBreeding }}>
            {children}
        </BreedingContext.Provider>
    );
}
