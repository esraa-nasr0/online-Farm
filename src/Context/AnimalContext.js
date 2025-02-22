import axios from "axios";
import { createContext } from "react";

export let AnimalContext = createContext();

// Helper function to generate headers with the latest token
const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');

    // Ensure the token has only one "Bearer" prefix
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;

    return {
        Authorization: formattedToken
    };
};

// Fetch all animals
function getAnimals(page, limit, filters = {}) {
    const headers = getHeaders(); // Get the latest headers

    return axios.get('https://farm-project-bbzj.onrender.com/api/animal/getallanimals', {
        params: {
            page,
            limit,
            ...filters // Pass additional filters like tagId, breed, etc.
        },
        headers
    })
    .then((response) => response)
    .catch((err) => err);
}

// Remove an animal by ID
function removeAnimals(id) {
    const headers = getHeaders(); // Get the latest headers

    return axios.delete(`https://farm-project-bbzj.onrender.com/api/animal/deleteanimal/${id}`, { headers })
        .then((response) => response)
        .catch((error) => error);
}

// Fetch animal costs
function costAnimal(page, limit, filters = {}) {
    const headers = getHeaders(); // Get the latest headers

    return axios.get(`https://farm-project-bbzj.onrender.com/api/animal/getanimalCost`, {
        params: {
            page,
            limit,
            ...filters // Pass additional filters like tagId, breed, etc.
        },
        headers
    })
    .then((response) => response)
    .catch((error) => error);
}

// Context Provider
export default function AnimalContextProvider(props) {
    return (
        <AnimalContext.Provider value={{ removeAnimals, getAnimals, costAnimal }}>
            {props.children}
        </AnimalContext.Provider>
    );
}