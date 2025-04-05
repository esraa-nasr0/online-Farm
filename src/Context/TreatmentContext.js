import axios from "axios";
import { createContext } from "react";

export let TreatmentContext = createContext();



const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
  
   
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
  
    return {
        Authorization: formattedToken
    };
  };

function getTreatment(page, limit, filters = {}) {
    const headers = getHeaders(); 
    return axios
        .get(`https://farm-project-bbzj.onrender.com/api/treatment/getalltreatmentes`, {
            params: {
                page,
                limit,
                ...filters 
            }, headers })
        .then((response) => response)
        .catch((err) => err);
}

function deleteTreatment(id) {
    const headers = getHeaders(); 
    return axios
        .delete(`https://farm-project-bbzj.onrender.com/api/treatment/deletetreatment/${id}`, { headers })
        .then((response) => response)
        .catch((err) => err);
}

function getTreatmentByAnimal(page, limit, filters = {}) {
    const headers = getHeaders(); 
    return axios
        .get(`https://farm-project-bbzj.onrender.com/api/treatment/getAlltreatmentforAnimals`, {
            params: {
                page,
                limit,
                ...filters 
            },
            headers })
        .then((response) => response)
        .catch((err) => err);
}

function deleteTreatmentByAnimal(id) {
    const headers = getHeaders(); 
    return axios
        .delete(`https://farm-project-bbzj.onrender.com/api/treatment/deletetreatmentforAnimals/${id}`, { headers })
        .then((response) => response)
        .catch((err) => err);
}


function getTreatmentMenue() {
    const headers = getHeaders(); 
    return axios
        .get(`https://farm-project-bbzj.onrender.com/api/treatment/gettreatments`, { headers })
        .then((response) => response)
        .catch((err) => err);
}

export default function TreatmentContextProvider(props) {
    return (
        <TreatmentContext.Provider value={{ getTreatment , deleteTreatment , getTreatmentByAnimal , deleteTreatmentByAnimal , getTreatmentMenue}}>
            {props.children}
        </TreatmentContext.Provider>
    );
}
