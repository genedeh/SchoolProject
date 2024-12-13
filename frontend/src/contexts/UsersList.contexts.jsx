import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const UsersListContext = createContext();

export const UsersListProvider = ({ children }) => {
    const [usersList, setUsersList] = useState([]);
    const [refresh, setRefresh] = useState(false)
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const [term, setTerm] = useState("");
    const [nextPage, setNextPage] = useState(null);   // URL of next page
    const [prevPage, setPrevPage] = useState(null);   // URL of previous page
    const [totalUsers, setTotalUsers] = useState(0);  // Total number of users
    const [loading, setLoading] = useState(false);    // Loading state

    // Functions to handle pagination
    const goToNextPage = () => {
        if (nextPage) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPrevPage = () => {
        if (prevPage) {
            setCurrentPage(currentPage - 1);
        }
    };
    const value = {
        usersList, setUsersList, refresh, setRefresh, currentPage, setCurrentPage,
        totalUsers,
        nextPage,
        prevPage,
        loading,
        goToNextPage,
        goToPrevPage, setTerm
    };

    const fetchUserProfilesList = async (page = 1) => {
        const token = localStorage.getItem('token');
        if (token) {
            setLoading(true);
            try {
                const response = await axios.get(`/api/users/?page=${page}&username=${term}`)
                const data = await response.data;
                setUsersList(data.results);
                setNextPage(data.next);
                setPrevPage(data.previous);
                setTotalUsers(data.count);
            } catch (err) {
                console.error('There was an error fetching the items!', err);
            }
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUserProfilesList(currentPage);
    }, [refresh, currentPage, term]);


    return <UsersListContext.Provider value={value}>{children}</UsersListContext.Provider>;
}
