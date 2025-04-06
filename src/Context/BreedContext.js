import axios from "axios";
import { createContext } from "react";

export let BreedContext = createContext();

// Helper function to generate headers with the latest token
const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
    return {
        Authorization: formattedToken
    };
};

// Fetch all animals
function BreedMenue() {
    const headers = getHeaders(); // Get the latest headers

    return axios.get('https://farm-project-bbzj.onrender.com/api/breed/GetAll-breeds-menue', {
        headers
    })
    .then((response) => response)
    .catch((err) => err);
}

//Remove an animal by ID
function removeBreed(id) {
    const headers = getHeaders(); 
    return axios.delete(`https://farm-project-bbzj.onrender.com/api/breed/deletebreed/${id}`, { headers })
        .then((response) => response)
        .catch((error) => error);
}

// Fetch all breed
function getBreed(page, limit, filters = {}) {
    const headers = getHeaders(); 
    return axios.get(`https://farm-project-bbzj.onrender.com/api/breed/GetAll-breeds`, {
        params: {
            page,
            limit,
            ...filters 
        },
        headers
    })
    .then((response) => response)
    .catch((error) => error);
}

// Context Provider
export default function BreedContextProvider(props) {
    return (
        <BreedContext.Provider value={{ BreedMenue , getBreed , removeBreed }}>
            {props.children}
        </BreedContext.Provider>
    );
}