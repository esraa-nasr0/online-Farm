import axiosInstance from "../api/axios";
import { createContext } from "react";

export let DashboardContext = createContext();

function getUsers(page, limit, filters = {}) {
    return axiosInstance.get('/getusers', {
        params: {
            page,
            limit,
            ...filters // Pass additional filters like tagId, breed, etc.
        }
    })
    .then((response) => response)
    .catch((err) => err);
}


export default function DashboardContextContextProvider(props) {
    return <DashboardContext.Provider value={{  getUsers  }}>
        {props.children}
    </DashboardContext.Provider>;
}
