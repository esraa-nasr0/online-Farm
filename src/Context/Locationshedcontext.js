import axios from "axios";
import { createContext } from "react";

export let LocationContext = createContext();



const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
  
   
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
  
    return {
        Authorization: formattedToken
    };
    };

function getLocationtMenue() {
    const headers = getHeaders(); 
    return axios
        .get(`https://farm-project-bbzj.onrender.com/api/location/GetAll-Locationsheds-menue`, { headers })
        .then((response) => response)
        .catch((err) => err);
}

function getVaccineMenue() {
    const headers = getHeaders(); 
    return axios
        .get(`https://farm-project-bbzj.onrender.com/api/vaccine/GetVaccine-menue`, { headers })
        .then((response) => response)
        .catch((err) => err);
}

export default function LocationContextshedProvider(props) {
    return (
        <LocationContext.Provider value={{ getLocationtMenue,getVaccineMenue}}>
            {props.children}
        </LocationContext.Provider>
    );
}
