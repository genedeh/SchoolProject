import { useContext } from "react";
// import { Navigate } from "react-router-dom";
import { UserContext } from "../../contexts/User.contexts";

const PrivateRoute = ({ Component, AltComponent }) => {

    const { currentUser } = useContext(UserContext);
    return currentUser.is_student_or_teacher ? <Component /> : <AltComponent />;
};
export default PrivateRoute;