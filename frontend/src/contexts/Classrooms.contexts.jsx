import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ClassroomsContext = createContext();

export const ClassroomsProvider = ({ children }) => {
    const [classrooms, setClassrooms] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const [term, setTerm] = useState("");
    const [nextPage, setNextPage] = useState(null);   // URL of next page
    const [prevPage, setPrevPage] = useState(null);   // URL of previous page
    const [totalClassrooms, setTotalClassrooms] = useState(0);  // Total number of users
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

    const fetchClassrooms = async (page = 1) => {
        const token = localStorage.getItem('token')
        if (token) {
            setLoading(true);
            try {
                const response = await axios.get(`api/classrooms/?page=${page}&name=${term}`)
                const data = await response.data;
                setClassrooms(data.results);
                setNextPage(data.next);
                setPrevPage(data.previous);
                setTotalClassrooms(data.count);
            } catch (err) {
                console.log('There was an error fetching the items!', err)
            }
            setLoading(false);
        }
    }
    const value = {
        classrooms, setClassrooms, currentPage, setCurrentPage,
        totalClassrooms,
        nextPage,
        prevPage,
        loading,
        goToNextPage,
        goToPrevPage, setTerm, fetchClassrooms
    };
    useEffect(() => {
        fetchClassrooms(currentPage);
    }, [currentPage, term])
    return <ClassroomsContext.Provider value={value}>{children}</ClassroomsContext.Provider>
}