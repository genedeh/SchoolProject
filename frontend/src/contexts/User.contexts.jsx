import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext({
    currentUser: null,
    setCurrentUser: () => null,
});

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const value = { currentUser, setCurrentUser };
    // useEffect(() => {
    //     const fetchUserProfile = async () => {
    //         const token = localStorage.getItem('token');
    //         if (token) {
    //             try {
    //                 const response = await axios.get('http://127.0.0.1:8000/api/profile/', {
    //                     headers: {
    //                         'Authorization': `Bearer ${token}`,
    //                     },
    //                 });
    //                 setCurrentUser(response.data);
    //                 setUserProfileFetched(true)
    //             } catch (err) {
    //                 setError('Failed to fetch user profile'.toLocaleUpperCase());
    //             }
    //         } else {
    //             setError('No token found');
    //         }
    //     };
    //     return fetchUserProfile;
    // }, [currentUser, []])
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
