import axiosInstance from "../api/axios";
import { createContext } from "react";
export const Feedcontext = createContext();

function getAllFeed(page, limit, filters = {}) {
    return axiosInstance
        .get('/feed/getallfeeds', {
            params: {
                page,
                limit,
                ...filters
            }
        })
        .then((response) => response.data)
        .catch((err) => {
            console.error('Error fetching feed data:', err);
            throw err;
        });
}

 async function Deletfeed(id){
    try {
        const response = await axiosInstance.delete(`/feed/DeleteFeed/${id}`);
        return response.data;
    } catch (err) {
        console.error("Error deleting vaccine:", err.response ? err.response.data : err.message);
        throw err;
    }
    
}

function getFodder(page, limit, filters = {}) {
    return axiosInstance
        .get(`/fodder/getallfodder`, {
            params: {
                page,
                limit,
                ...filters // Pass additional filters like tagId, breed, etc.
            }
        })
        .then((response) => response)
        .catch((err) => err);
}


function deleteFodder(id) {
    return axiosInstance
        .delete(`/fodder/deletefodder/${id}`)
        .then((response) => response)
        .catch((err) => err);
}

function getFodderMenue() {
    return axiosInstance
        .get(`/feed/getfeeds`)
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
