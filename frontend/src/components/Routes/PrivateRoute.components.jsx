import { useUser } from "../../contexts/User.contexts";

export const PrivateRoute = ({ Component, AltComponent }) => {

    const { currentUser } = useUser();
    return currentUser.is_student_or_teacher ? <Component /> : <AltComponent />;
};

export const AdminPrivateRoute = ({ Component, AltComponent }) => {

    const { currentUser } = useUser();
    console.log(currentUser);
    return currentUser.is_superuser ? <Component /> : <AltComponent />;
};