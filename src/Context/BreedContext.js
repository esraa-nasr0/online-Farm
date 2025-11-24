import axiosInstance from "../api/axios";
import { createContext } from "react";

export let BreedContext = createContext();

// Fetch all animals
function BreedMenue() {
    return axiosInstance.get('/breed/GetAll-breeds-menue')
    .then((response) => response)
    .catch((err) => err);
}

//Remove an animal by ID
function removeBreed(id) {
    return axiosInstance.delete(`/breed/deletebreed/${id}`)
        .then((response) => response)
        .catch((error) => error);
}

// Fetch all breed
function getBreed(page, limit, filters = {}) {
    return axiosInstance.get(`/breed/GetAll-breeds`, {
        params: {
            page,
            limit,
            ...filters 
        }
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