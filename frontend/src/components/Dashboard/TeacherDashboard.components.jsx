const TeacherDashboard = ({user}) => {
    return (
        <div>
            <h1>User Profile For Teachers</h1>
            <p>ID: {user.id}</p>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
        </div>
    )
}

export default TeacherDashboard;