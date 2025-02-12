import axios from "axios";
import { createContext } from "react";

export let WeightContext = createContext();


let Authorization = localStorage.getItem('Authorization')
let headers = {
    Authorization: `Bearer ${Authorization}`
    }

    function getWeight(page, limit, filters = {}) {
        return axios.get(`https://farm-project-bbzj.onrender.com/api/weight/GetAllWeight` , {
            params: {
                page,
                limit,
                ...filters // Pass additional filters like tagId etc.
            },headers})
        .then((response)=>response)
        .catch((err)=>err)
    }

    
    function deleteWeight(id) {
        return axios.delete(`https://farm-project-bbzj.onrender.com/api/weight/DeleteWeight/${id}` , {headers})
        .then((response)=>response)
        .catch((err)=>err)
    }


    export default function WeightContextProvider(props) {
        return <WeightContext.Provider value={{getWeight , deleteWeight}}>
            {props.children}
        </WeightContext.Provider>
    }