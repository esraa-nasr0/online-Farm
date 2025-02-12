import axios from "axios";
import { createContext } from "react";
export const Feedcontext = createContext();

let Authorization = localStorage.getItem('Authorization') ;
let headers = {
    Authorization: `Bearer ${Authorization}`
};


function getAllFeed(page, limit, filters = {}) {
    return axios
        .get('https://farm-project-bbzj.onrender.com/api/feed/getallfeeds', {
            params: {
                page,
                limit,
                ...filters
            },
            headers
        })
        .then((response) => response.data)
        .catch((err) => {
            console.error('Error fetching feed data:', err);
            throw err;
        });
}

 async function Deletfeed(id){


    try {
        const response = await axios.delete(`https://farm-project-bbzj.onrender.com/api/feed/DeleteFeed/${id}`, { headers });
        return response.data;
    } catch (err) {
        console.error("Error deleting vaccine:", err.response ? err.response.data : err.message);
        throw err;
    }
    
}

function getFodder(page, limit, filters = {}) {
    return axios
        .get(`https://farm-project-bbzj.onrender.com/api/fodder/getallfodder`, {
            params: {
                page,
                limit,
                ...filters // Pass additional filters like tagId, breed, etc.
            },
            headers })
        .then((response) => response)
        .catch((err) => err);
}


function deleteFodder(id) {
    return axios
        .delete(`hhttps://farm-project-bbzj.onrender.com/api/fodder/deletefodder/${id}`, { headers })
        .then((response) => response)
        .catch((err) => err);
}

function getFodderMenue() {
    return axios
        .get(`https://farm-project-bbzj.onrender.com/api/feed/getfeeds`, { headers })
        .then((response) => response)
        .catch((err) => err);
}

export default function FeedContextProvider(props) {
    return (
        <Feedcontext.Provider value={{ getAllFeed ,Deletfeed , getFodder , deleteFodder , getFodderMenue}}>
            {props.children}
        </Feedcontext.Provider>
    );
}
