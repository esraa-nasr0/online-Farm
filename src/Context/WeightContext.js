import axios from "axios";
import { createContext } from "react";

export let WeightContext = createContext();


// Helper function to generate headers with the latest token
const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
  
    // Ensure the token has only one "Bearer" prefix
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
  
    return {
        Authorization: formattedToken
    };
  };
    function getWeight(page, limit, filters = {}) {
        const headers = getHeaders(); // Get the latest headers
        return axios.get(`https://api.mazraaonline.com/api/weight/GetAllWeight` , {
            params: {
                page,
                limit,
                ...filters // Pass additional filters like tagId etc.
            },headers})
        .then((response)=>response)
        .catch((err)=>err)
    }

    
    function deleteWeight(id) {
        const headers = getHeaders(); // Get the latest headers
        return axios.delete(`https://api.mazraaonline.com/api/weight/DeleteWeight/${id}` , {headers})
        .then((response)=>response)
        .catch((err)=>err)
    }


    export default function WeightContextProvider(props) {
        return <WeightContext.Provider value={{getWeight , deleteWeight}}>
            {props.children}
        </WeightContext.Provider>
    }