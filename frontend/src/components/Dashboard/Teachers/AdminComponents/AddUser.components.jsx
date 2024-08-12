import { useContext } from "react";
import { UserContext } from "../../../../contexts/User.contexts";
import { Navigate } from "react-router-dom";

export const AddUser = () => {
    const { currentUser } = useContext(UserContext);
    if (currentUser.is_admin && currentUser) {
        return (
            <div>ADMIN ADD USER</div>
        );
    } else if (currentUser.is_student_or_teacher) {
        return (
            <Navigate to="/dashboard/student-home" />
        );
    } return (
        <Navigate to="/dashboard/teacher-home" />
    );
};

