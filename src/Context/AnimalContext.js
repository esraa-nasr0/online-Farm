import axiosInstance from "../api/axios";
import { createContext } from "react";

export let AnimalContext = createContext();

// Fetch all animals
function getAnimals(page, limit, filters = {}) {
    return axiosInstance.get('/animal/getallanimals', {
        params: {
            page,
            limit,
            ...filters // Pass additional filters like tagId, breed, etc.
        }
    })
    .then((response) => response)
    .catch((err) => err);
}

// Remove an animal by ID
function removeAnimals(id) {
    return axiosInstance.delete(`/animal/deleteanimal/${id}`)
        .then((response) => response)
        .catch((error) => error);
}

// Fetch animal costs
function costAnimal(page, limit, filters = {}) {
    return axiosInstance.get(`/animal/getanimalCost`, {
        params: {
            page,
            limit,
            ...filters // Pass additional filters like tagId, breed, etc.
        }
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