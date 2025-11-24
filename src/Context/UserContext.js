import { createContext, useState, useEffect } from "react";
import { getToken } from "../utils/authToken";

export let UserContext = createContext();


export default function UserContextProvider(props) {

    const [Authorization , setAuthorization] = useState(null);

    // Initialize from cookie on mount
    useEffect(() => {
        const token = getToken();
        if (token) {
            setAuthorization(token);
        }
    }, []);

    return <UserContext.Provider value={{Authorization , setAuthorization}}>
        {props.children}
    </UserContext.Provider>

}