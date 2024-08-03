import { Navbar } from 'react-bootstrap'

const TeacherDashboard = ({ user }) => {
    return (
        <>
            <Navbar>
                <Navbar.Brand>Teachers</Navbar.Brand>
            </Navbar>
            <div>
                <h1>User Profile For Teachers</h1>
                <p>ID: {user.id}</p>
                <p>Username: {user.username}</p>
                <p>Email: {user.email}</p>
            </div>
        </>
    )
}

export default TeacherDashboard;