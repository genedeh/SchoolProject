import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../../../contexts/User.contexts";

export const AssignedSubjects = () => {
    const { currentUser } = useContext(UserContext);
    
    if (!currentUser.is_student_or_teacher && currentUser && !currentUser.is_admin) {
        return <div>HEY</div>
    } return (
        <Navigate to='/dashboard/home' />
    );
}