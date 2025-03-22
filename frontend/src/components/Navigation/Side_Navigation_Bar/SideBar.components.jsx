import { Navbar, Nav, Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { HouseDoor, PersonCircle, PersonPlus, BarChart, Calendar2Event, Book, Building } from "react-bootstrap-icons";
import './SideBar.styles.css'
import { useUser } from '../../../contexts/User.contexts';

export const StudentSidebar = () => {
    const location = useLocation(); // Get current URL

    return (
        <div className="floating-navbar">
            <Nav className="nav-links">
                <Nav.Link href="/dashboard/home" className={`nav-item ${location.pathname === "/dashboard/home" ? "active" : ""}`}>
                    <HouseDoor className="me-2 icon" /> Home
                </Nav.Link>
                <Nav.Link href="/dashboard/student-profile" className={`nav-item ${location.pathname === "/dashboard/teacher-profile" ? "active" : ""}`}>
                    <PersonCircle className="me-2 icon" /> Profile
                </Nav.Link>
                <Nav.Link href="/dashboard/student-results" className={`nav-item ${location.pathname === "/dashboard/student-results" ? "active" : ""}`}>
                    <BarChart className="me-2 icon" /> Results
                </Nav.Link>
            </Nav>
        </div>
    );
};

export const TeacherSidebar = () => {
    const { currentUser } = useUser();
    const { is_superuser } = currentUser;

    const location = useLocation(); // Get current URL

    if (is_superuser) {
        return (
            <div className="floating-navbar">
                <Nav className="nav-links">
                    <Nav.Link href="/dashboard/home" className={`nav-item ${location.pathname === "/dashboard/home" ? "active" : ""}`}>
                        <HouseDoor className="me-2 icon" /> Home
                    </Nav.Link>
                    <Nav.Link href="/dashboard/teacher-profile" className={`nav-item ${location.pathname === "/dashboard/teacher-profile" ? "active" : ""}`}>
                        <PersonCircle className="me-2 icon" /> Profile
                    </Nav.Link>
                    <Nav.Link href="/dashboard/add-user" className={`nav-item ${location.pathname === "/dashboard/add-user" ? "active" : ""}`}>
                        <PersonPlus className="me-2 icon" /> Add User
                    </Nav.Link>
                    <Nav.Link href="/dashboard/student-results" className={`nav-item ${location.pathname === "/dashboard/student-results" ? "active" : ""}`}>
                        <BarChart className="me-2 icon" /> Results
                    </Nav.Link>
                    <Nav.Link href="/dashboard/migrate-students" className={`nav-item ${location.pathname === "/dashboard/migrate-students" ? "active" : ""}`}>
                        <Calendar2Event className="me-2 icon" /> Migrate
                    </Nav.Link>
                    <Nav.Link href="/dashboard/subjects" className={`nav-item ${location.pathname === "/dashboard/subjects" ? "active" : ""}`}>
                        <Book className="me-2 icon" /> Subjects
                    </Nav.Link>
                    <Nav.Link href="/dashboard/classrooms" className={`nav-item ${location.pathname === "/dashboard/classrooms" ? "active" : ""}`}>
                        <Building className="me-2 icon" /> Classrooms
                    </Nav.Link>
                </Nav>
            </div>
        );
    } else {
        return (
            <div className="floating-navbar">
                <Nav className="nav-links">
                    <Nav.Link href="/dashboard/home" className={`nav-item ${location.pathname === "/dashboard/home" ? "active" : ""}`}>
                        <HouseDoor className="me-2 icon" /> Home
                    </Nav.Link>
                    <Nav.Link href="/dashboard/teacher-profile" className={`nav-item ${location.pathname === "/dashboard/teacher-profile" ? "active" : ""}`}>
                        <PersonCircle className="me-2 icon" /> Profile
                    </Nav.Link>
                    <Nav.Link href="/dashboard/subjects" className={`nav-item ${location.pathname === "/dashboard/subjects" ? "active" : ""}`}>
                        <Book className="me-2 icon" /> Subjects
                    </Nav.Link>
                    <Nav.Link href="/dashboard/classrooms" className={`nav-item ${location.pathname === "/dashboard/classrooms" ? "active" : ""}`}>
                        <Building className="me-2 icon" /> Classrooms
                    </Nav.Link>
                </Nav>
            </div>
        );
    }

}
