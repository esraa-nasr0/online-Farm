import axios from "axios";
import { createContext } from "react";


export let SupplierContext = createContext();


// Helper function to generate headers with the latest token
const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
  
    // Ensure the token has only one "Bearer" prefix
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
  
    return {
        Authorization: formattedToken
    };
  };

    function getSupplier(page, limit, filters = {}) {
        const headers = getHeaders(); // Get the latest headers

        return axios.get(`https://api.mazraaonline.com/api/supplier/getallsuppliers` , {
            params: {
                page,
                limit,
                ...filters // Pass additional filters like tagId etc.
            },headers})
        .then((response)=>response)
        .catch((err)=>err)
    }

    function deleteSupplier(id) {
        const headers = getHeaders(); // Get the latest headers

        return axios.delete(`https://api.mazraaonline.com/api/supplier/deletesupplier/${id}` , {headers})
        .then((response)=>response)
        .catch((err)=>err)
    }


    export default function SupplierContextProvider(props) {
        return <SupplierContext.Provider value={{getSupplier , deleteSupplier}}>
            {props.children}
        </SupplierContext.Provider>
    }
