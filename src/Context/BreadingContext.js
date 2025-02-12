import axios from "axios";
import { createContext } from "react";

export let Breadingcontext = createContext();

let Authorization = localStorage.getItem('Authorization');

let headers = {
    Authorization:` Bearer ${Authorization}`
};

// Function to get all breeding entries with pagination and optional filters
function getAllBreeding(page, limit, filters = {}) {
    return axios.get('https://farm-project-bbzj.onrender.com/api/breeding/GetAllBreeding', {
        params: {
            page,
            limit,
            ...filters 
        },
        headers
    })
    .then((response) => response)
    .catch((err) => err);
}

// Function to delete a breeding entry by ID
export function deleteBreeding(id) {
    return axios.delete(`https://farm-project-bbzj.onrender.com/api/breeding/DeleteBreeding/${id}`, { headers })
        .then((response) => response)
        .catch((err) => err);
}

export default function BreadingContextProvider(props) {
    return (
        <Breadingcontext.Provider value={{ getAllBreeding, deleteBreeding }}>
            {props.children}
        </Breadingcontext.Provider>
    );
}