import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext({
    currentUser: null,
    setCurrentUser: () => null,
    error: '',
    setError: () => '',
});

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState(null);
    const value = { currentUser,setCurrentUser, error };
    let navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (token) {
                try {
                    const response = await axios.get('api/profile/', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    setError(null);
                    setCurrentUser(response.data);
                } catch (err) {
                    setError('Failed to fetch user profile'.toLocaleUpperCase());
                }
            } else {
                setError('No token found');
                return navigate('/');
            }
        };
        fetchUserProfile();
    }, [token])


    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
