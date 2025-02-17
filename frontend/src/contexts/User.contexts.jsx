import { useState, useEffect, useMemo, createContext, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserContext = createContext({
    currentUser: null,
    setCurrentUser: () => null,
    error: "",
    setError: () => "",
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (token) {
                try {
                    const response = await axios.get("/api/profile/", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setError(null);
                    setCurrentUser(response.data);
                } catch (err) {
                    setError("FAILED TO FETCH USER PROFILE");
                }
            } else {
                setError("NO TOKEN FOUND");
                navigate("/");
            }
        };

        fetchUserProfile();
    }, [token, navigate]);

    const value = useMemo(() => ({
        currentUser,
        setCurrentUser,
        error,
        setError,
    }), [currentUser, error]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
