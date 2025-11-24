import axiosInstance from "../api/axios";
import { createContext } from "react";

export let LocationContext = createContext();

// Fetch all animals
function LocationMenue() {
    return axiosInstance.get('/location/GetAll-Locationsheds-menue')
    .then((response) => response)
    .catch((err) => err);
}

//Remove an animal by ID
function removeLocation(id) {
    return axiosInstance.delete(`/location/deletelocationShed/${id}`)
        .then((response) => response)
        .catch((error) => error);
}

// Fetch all location shed
function getLocation(page, limit, filters = {}) {
    return axiosInstance.get(`/location/GetAll-Locationsheds`, {
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
export default function LocationContextProvider(props) {
    return (
        <LocationContext.Provider value={{ LocationMenue ,getLocation ,removeLocation }}>
            {props.children}
        </LocationContext.Provider>
    );
}