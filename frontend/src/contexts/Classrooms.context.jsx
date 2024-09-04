import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ClassroomsContext = createContext({
    classrooms: [],
    setClassrooms: () => [],
});

export const ClassroomsProvider = ({ children }) => {
    const [classrooms, setClassrooms] = useState([]);
    const value = { classrooms, setClassrooms };

    useEffect(() => {
        const fetchClassrooms = async () => {
            const token = localStorage.getItem('token')
            if (token) {
                try {
                    const response = await axios.get('api/classrooms/')

                    setClassrooms(response.data)
                } catch (err) {
                    console.log('There was an error fetching the items!', err)
                }
            }
        }
        fetchClassrooms();
    }, [classrooms])
    return <ClassroomsContext.Provider value={value}>{children}</ClassroomsContext.Provider>
}