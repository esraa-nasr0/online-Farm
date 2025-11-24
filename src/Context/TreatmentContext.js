import axiosInstance from "../api/axios";
import { createContext } from "react";

export let TreatmentContext = createContext();

function getTreatment(page, limit, filters = {}) {
    return axiosInstance
        .get(`/treatment/getalltreatmentes`, {
            params: {
                page,
                limit,
                ...filters 
            }
        })
        .then((response) => response)
        .catch((err) => err);
}

function deleteTreatment(id) {
    return axiosInstance
        .delete(`/treatment/deletetreatment/${id}`)
        .then((response) => response)
        .catch((err) => err);
}

function getTreatmentByAnimal(page, limit, filters = {}) {
    return axiosInstance
        .get(`/treatment/getAlltreatmentforAnimals`, {
            params: {
                page,
                limit,
                ...filters 
            }
        })
        .then((response) => response)
        .catch((err) => err);
}

function deleteTreatmentByAnimal(id) {
    return axiosInstance
        .delete(`/treatment/deletetreatmentforAnimals/${id}`)
        .then((response) => response)
        .catch((err) => err);
}


function getTreatmentMenue() {
    return axiosInstance
        .get(`/treatment/gettreatments`)
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
