import axios from "axios";
import { createContext } from "react";

let Authorization = localStorage.getItem('Authorization');
let headers = {
    Authorization:` Bearer ${Authorization}`
};

export let Feedbylocationcontext=createContext()
function getAllfeeds(page, limit, filters = {}) {
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