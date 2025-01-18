import React, { createContext, useContext, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";

const SubjectsContext = createContext();

export const useSubjects = () => useContext(SubjectsContext);

export const SubjectsProvider = ({ children }) => {
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const [term, setTerm] = useState("");

    // Function to fetch subjects
    const fetchSubjects = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Authentication token is missing!");
        }

        const response = await axios.get(
            `/api/subjects/?page=${currentPage}&name=${term}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    };


    // Using React Query for data fetching
    const { data, error, isError, isLoading, isFetching, refetch } = useQuery(
        ["subjects", currentPage, term], // Query key
        fetchSubjects,
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
        subjects: data?.results || [],
        totalSubjects: data?.count || 0,
        currentPage,
        nextPage: data?.next,
        prevPage: data?.previous,
        loading: isLoading || isFetching,
        error,
        isError,
        goToNextPage,
        goToPrevPage,
        setTerm,
        handleSearch,
        setCurrentPage,
        refetchNewData,
    };
    return <SubjectsContext.Provider value={value}>{children}</SubjectsContext.Provider>
}