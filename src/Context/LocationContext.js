import axios from "axios";
import { createContext } from "react";

export let LocationContext = createContext();

// Helper function to generate headers with the latest token
const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
    return {
        Authorization: formattedToken
    };
};

// Fetch all animals
function LocationMenue() {
    const headers = getHeaders(); // Get the latest headers

    return axios.get('https://api.mazraaonline.com/api/location/GetAll-Locationsheds-menue', {
        headers
    })
    .then((response) => response)
    .catch((err) => err);
}

//Remove an animal by ID
function removeLocation(id) {
    const headers = getHeaders(); 
    return axios.delete(`https://api.mazraaonline.com/api/location/deletelocationShed/${id}`, { headers })
        .then((response) => response)
        .catch((error) => error);
}

// Fetch all location shed
function getLocation(page, limit, filters = {}) {
    const headers = getHeaders(); 
    return axios.get(`https://api.mazraaonline.com/api/location/GetAll-Locationsheds`, {
        params: {
            page,
            limit,
            ...filters 
        },
        headers
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