import axiosInstance from "../api/axios";
import { createContext } from "react";


export let SupplierContext = createContext();

    function getSupplier(page, limit, filters = {}) {
        return axiosInstance.get(`/supplier/getallsuppliers` , {
            params: {
                page,
                limit,
                ...filters // Pass additional filters like tagId etc.
            }
        })
        .then((response)=>response)
        .catch((err)=>err)
    }

    function deleteSupplier(id) {
        return axiosInstance.delete(`/supplier/deletesupplier/${id}`)
        .then((response)=>response)
        .catch((err)=>err)
    }


    export default function SupplierContextProvider(props) {
        return <SupplierContext.Provider value={{getSupplier , deleteSupplier}}>
            {props.children}
        </SupplierContext.Provider>
    }
