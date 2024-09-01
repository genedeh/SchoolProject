import { useContext } from "react";
// import { Navigate } from "react-router-dom";
import { UserContext } from "../../contexts/User.contexts";

export const PrivateRoute = ({ Component, AltComponent }) => {

    const { currentUser } = useContext(UserContext);
    return currentUser.is_student_or_teacher ? <Component /> : <AltComponent />;
};

export const AdminPrivateRoute = ({ Component, AltComponent }) => {

    const { currentUser } = useContext(UserContext);
    return currentUser.is_admin ? <Component /> : <AltComponent />;
};