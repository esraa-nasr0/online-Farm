import { createContext, useState } from "react";

export let UserContext = createContext();


export default function UserContextProvider(props) {

    const [Authorization , setAuthorization] = useState(null);

    return <UserContext.Provider value={{Authorization , setAuthorization}}>
        {props.children}
    </UserContext.Provider>

}