import { createContext, useEffect, useState} from "react";
import axios from "axios";

export const SubjectsContext = createContext({
    subjects: [],
    setSubjects: () => [],
});

export const SubjectsProvider = ({ children }) => {
    const [subjects, setSubjects] = useState([]);
    const value = { subjects, setSubjects };

    useEffect(() => {
        const fetchSubjects = async () => {
            const token = localStorage.getItem('token')
            if (token) {
                try {
                    const response = await axios.get('api/subjects/')

                    setSubjects(response.data)
                } catch (err) {
                    console.log('There was an error fetching the items!', err)
                }
            }
        }
        fetchSubjects();
    }, [subjects])
    return <SubjectsContext.Provider value={value}>{children}</SubjectsContext.Provider>
}