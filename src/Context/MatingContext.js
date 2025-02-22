import axios from "axios";
import { createContext } from "react";


export let MatingContext = createContext();


// Helper function to generate headers with the latest token
const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
  
    // Ensure the token has only one "Bearer" prefix
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
  
    return {
        Authorization: formattedToken
    };
  };

    function getMating(page, limit, filters = {}) {
        const headers = getHeaders(); // Get the latest headers

        return axios.get(`https://farm-project-bbzj.onrender.com/api/mating/getallmating` , {
            params: {
                page,
                limit,
                ...filters // Pass additional filters like tagId etc.
            },headers})
        .then((response)=>response)
        .catch((err)=>err)
    }

    function deleteMating(id) {
        const headers = getHeaders(); // Get the latest headers

        return axios.delete(`https://farm-project-bbzj.onrender.com/api/mating/deletemating/${id}` , {headers})
        .then((response)=>response)
        .catch((err)=>err)
    }


    export default function MatingContextProvider(props) {
        return <MatingContext.Provider value={{getMating , deleteMating}}>
            {props.children}
        </MatingContext.Provider>
    }
