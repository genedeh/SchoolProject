import { useContext } from "react";
import { UserContext } from "../../../../contexts/User.contexts";
import { Navigate } from "react-router-dom";

export const AddUser = () => {
    const { currentUser } = useContext(UserContext);
    if (currentUser.is_admin && currentUser) {
        return (
            <div>ADMIN ADD USER</div>
        );
    } return (
        <Navigate to="/dashboard/home" />
    );
};

