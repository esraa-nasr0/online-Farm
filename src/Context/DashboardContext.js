import axios from "axios";
import { createContext } from "react";

export let DashboardContext = createContext();

// Helper function to generate headers with the latest token
const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
  
    // Ensure the token has only one "Bearer" prefix
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
  
    return {
        Authorization: formattedToken
    };
  };

function getUsers(page, limit, filters = {}) {
    const headers = getHeaders(); // Get the latest headers

    return axios.get('https://api.mazraaonline.com/api/getusers', {
        params: {
            page,
            limit,
            ...filters // Pass additional filters like tagId, breed, etc.
        },
        headers
    })
    .then((response) => response)
    .catch((err) => err);
}


export default function DashboardContextContextProvider(props) {
    return <DashboardContext.Provider value={{  getUsers  }}>
        {props.children}
    </DashboardContext.Provider>;
}
