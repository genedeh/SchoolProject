import { UserContext } from "../../../../contexts/User.contexts";
import { useContext } from "react";
import { Navigate } from "react-router-dom";


export const Classrooms = () => {
    const { currentUser } = useContext(UserContext);
    if (!currentUser.is_student_or_teacher && currentUser && currentUser.is_admin) {
        return (
            <div>Classrooms</div>
        )
    } return (
        <Navigate to='/dashboard/home' />
    );
}