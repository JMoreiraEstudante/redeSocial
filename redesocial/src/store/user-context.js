import { createContext, useState } from "react";

const UserContext = createContext({
    user: '',
    userPick: (id) => {}    
})

export function UserContextProvider(props){
    const [userSelected, setUserSelected] = useState('');

    function userPick(id) {
        setUserSelected(id)
    }

    const context = {
        user: userSelected,
        userPick: userPick,
    }

    return (
        <UserContext.Provider value={context}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContext