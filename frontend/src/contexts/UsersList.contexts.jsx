import React, { createContext, useContext, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";

const UsersContext = createContext();

// Custom hook for accessing the context
export const useUsers = () => useContext(UsersContext);

export const UsersProvider = ({ children }) => {
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const [term, setTerm] = useState(""); // Search term

    // Function to fetch classrooms
    const fetchUsers = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Authentication token is missing!");
        }

        const response = await axios.get(
            `/api/users/?page=${currentPage}&username=${term || ''}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    };

    // Using React Query for data fetching
    const { data, error, isError, isLoading, isFetching, refetch } = useQuery(
        ["users", currentPage, term], // Query key
        fetchUsers,
        {
            keepPreviousData: true,
            retry: 3,
            staleTime: 1000 * 60 * 5,
            cacheTime: 1000 * 60 * 10,
        }
    );
    // Pagination handlers
    const goToNextPage = () => {
        if (data?.next) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const goToPrevPage = () => {
        if (data?.previous) {
            setCurrentPage((prev) => Math.max(prev - 1, 1));
        }
    };

    const handleSearch = () => {
        setCurrentPage(1); // Reset to the first page on search
        refetch(); // Refetch data based on the new term
    };

    const refetchNewData = () => {
        setCurrentPage(1); // Reset to the first page on search
        setTerm("")
        refetch(); // Refetch data based on the new term
    };

    const value = {
        users: data?.results || [],
        totalUsers: data?.count || 0,
        currentPage,
        nextPage: data?.next,
        prevPage: data?.previous,
        loading: isLoading || isFetching,
        usersError: error,
        usersIsError: isError,
        goToNextPage,
        goToPrevPage,
        setTerm,
        handleSearch,
        refetchNewData,
    };

    return (
        <UsersContext.Provider value={value}>
            {children}
        </UsersContext.Provider>
    );
};
