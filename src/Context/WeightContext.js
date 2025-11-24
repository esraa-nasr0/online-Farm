import axiosInstance from "../api/axios";
import { createContext } from "react";

export let WeightContext = createContext();

    function getWeight(page, limit, filters = {}) {
        return axiosInstance.get(`/weight/GetAllWeight` , {
            params: {
                page,
                limit,
                ...filters // Pass additional filters like tagId etc.
            }
        })
        .then((response)=>response)
        .catch((err)=>err)
    }

    
    function deleteWeight(id) {
        return axiosInstance.delete(`/weight/DeleteWeight/${id}`)
        .then((response)=>response)
        .catch((err)=>err)
    }


    export default function WeightContextProvider(props) {
        return <WeightContext.Provider value={{getWeight , deleteWeight}}>
            {props.children}
        </WeightContext.Provider>
    }