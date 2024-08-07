import { createContext, useState } from 'react';

export const UsersListContext = createContext({
    usersList: [],
    setUsersList: () => [],
});

export const UsersListProvider = ({ children }) => {
    const [usersList, setUsersList] = useState([]);
    const value = { usersList, setUsersList };
    return <UsersListContext.Provider value={value}>{children}</UsersListContext.Provider>;
}
