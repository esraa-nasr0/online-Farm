import axiosInstance from "../api/axios";
import { createContext } from "react";


export let MatingContext = createContext();

    function getMating(page, limit, filters = {}) {
        return axiosInstance.get(`/mating/getallmating` , {
            params: {
                page,
                limit,
                ...filters // Pass additional filters like tagId etc.
            }
        })
        .then((response)=>response)
        .catch((err)=>err)
    }

    function deleteMating(id) {
        return axiosInstance.delete(`/mating/deletemating/${id}`)
        .then((response)=>response)
        .catch((err)=>err)
    }


    export default function MatingContextProvider(props) {
        return <MatingContext.Provider value={{getMating , deleteMating}}>
            {props.children}
        </MatingContext.Provider>
    }
