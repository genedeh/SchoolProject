const StudentDashboard = ({user}) => {
    return (
        <div>
            <h1>User Profile For Students</h1>
            <p>ID: {user.id}</p>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
        </div>
    )
}

export default StudentDashboard;