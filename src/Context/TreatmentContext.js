import axios from "axios";
import { createContext } from "react";

export let TreatmentContext = createContext();


let Authorization = localStorage.getItem('Authorization');
let headers = {
    Authorization: `Bearer ${Authorization}`
};

function getTreatment(page, limit, filters = {}) {
    return axios
        .get(`https://farm-project-bbzj.onrender.com/api/treatment/getalltreatmentes`, {
            params: {
                page,
                limit,
                ...filters // Pass additional filters like tagId, breed, etc.
            }, headers })
        .then((response) => response)
        .catch((err) => err);
}

function deleteTreatment(id) {
    return axios
        .delete(`https://farm-project-bbzj.onrender.com/api/treatment/deletetreatment/${id}`, { headers })
        .then((response) => response)
        .catch((err) => err);
}

function getTreatmentByAnimal(page, limit, filters = {}) {
    return axios
        .get(`https://farm-project-bbzj.onrender.com/api/treatment/getAlltreatmentforAnimals`, {
            params: {
                page,
                limit,
                ...filters // Pass additional filters like tagId, breed, etc.
            },
            headers })
        .then((response) => response)
        .catch((err) => err);
}

function deleteTreatmentByAnimal(id) {
    return axios
        .delete(`https://farm-project-bbzj.onrender.com/api/treatment/deletetreatmentforAnimals/${id}`, { headers })
        .then((response) => response)
        .catch((err) => err);
}


function getTreatmentMenue() {
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
