import { useMutation, useQuery } from "react-query";
import axios from "axios";

// Fetch migration progress
export const useMigrationProgress = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Authentication token is missing!");
    }
    return useQuery("migration-progress", async () => {
        const { data } = await axios.get("/api/migration-progress/", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data.progress;
    });
};

// Migrate students
export const useMigrateStudents = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Authentication token is missing!");
    }
    return useMutation(async (session) => {
        const { data } = await axios.post("/api/migrate-students/", { session }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data;
    });
};

