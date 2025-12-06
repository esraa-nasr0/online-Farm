import axiosInstance from "../api/axios";
import { createContext } from "react";

export let Feedbylocationcontext=createContext()

function getAllfeeds(page, limit, filters = {}) {
    return axiosInstance.get('/feed/getAllFeedByShed',{
        params: {
            page,
            limit,
            ...filters
        }
    })
    .then((response) => response)
    .catch((err) => err);
}

async function Deletfeed(id){
    try {
        const response = await axiosInstance.delete(`/feed/deletefeedByShed/${id}`);
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