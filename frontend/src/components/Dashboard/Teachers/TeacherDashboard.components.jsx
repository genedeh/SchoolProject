import { useContext } from 'react';
import { Navbar } from 'react-bootstrap'
import { UserContext } from '../../../contexts/User.contexts';

const TeacherDashboard = () => {
    const { currentUser } = useContext(UserContext)
    return (
        <>
            <Navbar>
                <Navbar.Brand>Teachers</Navbar.Brand>
            </Navbar>
            <div>
                <h1>User Profile For Teachers</h1>
                <p>ID: {currentUser.id}</p>
                <p>Username: {currentUser.username}</p>
                <p>Email: {currentUser.email}</p>
            </div>
        </>
    )
}

export default TeacherDashboard;