import { useState, useMemo } from "react";
import { useQuery } from "react-query";
import axios from "axios";

const fetchClassrooms = async (page, term) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Authentication token is missing!");
    }

    const response = await axios.get(`/api/classrooms/?page=${page}&name=${term}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
};

const useClassrooms = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [term, setTerm] = useState("");

    const { data, error, isError, isLoading, isFetching, refetch } = useQuery(
        ["classrooms", currentPage, term],
        () => fetchClassrooms(currentPage, term),
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
        setCurrentPage(1); // Reset to first page on search
        refetch();
    };

    const refetchNewData = () => {
        setCurrentPage(1);
        setTerm("");
        refetch();
    };

    return useMemo(() => ({
        classrooms: data?.results || [],
        totalClassrooms: data?.count || 0,
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
        refetchNewData,
    }), [data, currentPage, isLoading, isFetching, isError]);
};

export default useClassrooms;

