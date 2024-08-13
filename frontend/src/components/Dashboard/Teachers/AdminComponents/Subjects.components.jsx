import { useContext } from "react";
import { UserContext } from "../../../../contexts/User.contexts";
import { Navigate } from "react-router-dom";

export const Subjects = () => {
    const { currentUser } = useContext(UserContext);
    if (!currentUser.is_student_or_teacher && currentUser && currentUser.is_admin) {
        return (
            <div>Subjects</div>
        );
    } return (
        <Navigate to='/dashboard/home' />
    );
}