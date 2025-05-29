import axios from "axios";
import { createContext } from "react";

export let ExcludedContext = createContext();

const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
  
  
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
  
    return {
        Authorization: formattedToken
    };
  };

function getExcluted(page, limit, filters = {}) {
    const headers = getHeaders(); 

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
        throw err; 
    });
}


export function deleteExcluted(id) {
    const headers = getHeaders(); 

    return axios.delete(`https://farm-project-bbzj.onrender.com/api/excluded/deleteexcluded/${id}`, { headers })
        .then((response) => response)
        .catch((err) => {
            console.error("Error deleting excluded data:", err);
            throw err;
        });
}

export default function ExcludedContextProvider(props) {
    return (
        <ExcludedContext.Provider value={{ getExcluted, deleteExcluted }}>
            {props.children}
        </ExcludedContext.Provider>
    );
}
