import { useState, useMemo } from "react";
import { useQuery } from "react-query";
import axios from "axios";

const fetchUsers = async (page, term) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Authentication token is missing!");
    }

    const response = await axios.get(`/api/users/?page=${page}&username=${term || ''}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
};

const useUsers = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [term, setTerm] = useState("");

    const { data, error, isError, isLoading, isFetching, refetch } = useQuery(
        ["users", currentPage, term],
        () => fetchUsers(currentPage, term),
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
        setCurrentPage(1);
        refetch();
    };

    const refetchNewData = () => {
        setCurrentPage(1);
        setTerm("");
        refetch();
    };

    return useMemo(() => ({
        users: data?.results || [],
        totalUsers: data?.count || 0,
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

export default useUsers;
