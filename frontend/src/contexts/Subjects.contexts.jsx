import { createContext, useEffect, useState} from "react";
import axios from "axios";

export const SubjectsContext = createContext({
    subjects: [],
    setSubjects: () => [],
});

export const SubjectsProvider = ({ children }) => {
    const [subjects, setSubjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const [term, setTerm] = useState(""); 
    const [nextPage, setNextPage] = useState(null);   // URL of next page
    const [prevPage, setPrevPage] = useState(null);   // URL of previous page
    const [totalSubjects, setTotalSubjects] = useState(0);  // Total number of users
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
        subjects,
        setSubjects, currentPage, setCurrentPage,
        totalSubjects,
        nextPage,
        prevPage,
        loading,
        goToNextPage,
        goToPrevPage,setTerm
    };
    const fetchSubjects = async (page = 1) => {
        const token = localStorage.getItem('token')
        if (token) {
            setLoading(true);
            try {
                const response = await axios.get(`api/subjects/?page=${page}&name=${term}`)
                const data = await response.data;
                setSubjects(data.results);
                setNextPage(data.next);
                setPrevPage(data.previous);
                setTotalSubjects(data.count);
            } catch (err) {
                console.log('There was an error fetching the items!', err)
            }
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchSubjects(currentPage);
    }, [currentPage, term])
    return <SubjectsContext.Provider value={value}>{children}</SubjectsContext.Provider>
}