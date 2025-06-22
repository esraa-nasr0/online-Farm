import axios from "axios";
import { createContext } from "react";

export let NewvaccineContext = createContext();

const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
  
  
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
  
    return {
        Authorization: formattedToken
    };
  };

function getVaccinename(page, limit, filters = {}) {
    const headers = getHeaders(); 

    return axios.get(`https://farm-project-bbzj.onrender.com/api/vaccine-types`, {
        // params: {
        //     page,
        //     limit,
        //     ...filters
        // },
        headers
    })
    .then((response) => response)
    .catch((err) => {
        console.error("Error fetching excluded data:", err);
        throw err; 
    });
}


export default function NewvaccineContextProvider(props) {
    return (
        <NewvaccineContext.Provider value={{ getVaccinename }}>
            {props.children}
        </NewvaccineContext.Provider>
    );
}