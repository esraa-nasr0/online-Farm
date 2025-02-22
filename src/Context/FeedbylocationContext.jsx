import axios from "axios";
import { createContext } from "react";

// Helper function to generate headers with the latest token
const getHeaders = () => {
    const Authorization = localStorage.getItem('Authorization');
  
    // Ensure the token has only one "Bearer" prefix
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
  
    return {
        Authorization: formattedToken
    };
  };

export let Feedbylocationcontext=createContext()

function getAllfeeds(page, limit, filters = {}) {
    const headers = getHeaders(); // Get the latest headers

    return axios.get('https://farm-project-bbzj.onrender.com/api/feed/getAllFeedByShed',{
        params: {
            page,
            limit,
            ...filters
        },
        headers
    })
    .then((response) => response)
    .catch((err) => err);
}

async function Deletfeed(id){

    const headers = getHeaders(); // Get the latest headers

    try {
        const response = await axios.delete(`https://farm-project-bbzj.onrender.com/api/feed/deletefeedByShed/${id}`, { headers });
        return response.data;
    } catch (err) {
        console.error("Error deleting vaccine:", err.response ? err.response.data : err.message);
        throw err;
    }
    
}

export default function FeedbyLocationContextProvider(props) {
    return (
        <Feedbylocationcontext.Provider value={{ getAllfeeds ,Deletfeed}}>
            {props.children}
        </Feedbylocationcontext.Provider>
    );
}