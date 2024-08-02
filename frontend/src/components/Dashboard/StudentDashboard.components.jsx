import { Navbar } from 'react-bootstrap'

const StudentDashboard = ({ user }) => {
    return (
        <>
            <Navbar>
                <Navbar.Brand>Students</Navbar.Brand>
            </Navbar>
            <div>
                <h1>User Profile For Students</h1>
                <p>ID: {user.id}</p>
                <p>Username: {user.username}</p>
                <p>Email: {user.email}</p>
            </div>
        </>
    )
}

export default StudentDashboard;