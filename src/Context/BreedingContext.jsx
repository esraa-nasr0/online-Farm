import axiosInstance from "../api/axios";
import { createContext } from "react";

export let BreedingContext = createContext();

// Function to get all breeding entries with pagination and optional filters
export function getAllBreeding(page, limit, filters = {}) {
    return axiosInstance.get('/breeding/GetAllBreeding', {
        params: {
            page,
            limit,
            ...filters
        }
    })
    .then((response) => response.data)
    .catch((err) => {
        console.error("Error fetching breeding data:", err);
        throw err;
    });
}

// Function to delete a breeding entry by ID
export function deleteBreeding(id) {
    return axiosInstance.delete(`/breeding/DeleteBreeding/${id}`)
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
