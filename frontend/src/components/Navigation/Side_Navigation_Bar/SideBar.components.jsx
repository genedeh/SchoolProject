import { Nav } from "react-bootstrap";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { HouseDoor, PersonCircle, PersonPlus, BarChart, Calendar2Event, Book, Building } from "react-bootstrap-icons";
import { FiMenu, FiX } from "react-icons/fi";
import './SideBar.styles.css'
import { useUser } from '../../../contexts/User.contexts';

export const StudentSidebar = () => {
    const location = useLocation(); // Get current URL
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`floating-navbar-container ${isOpen ? "open" : ""}`}>
            {/* Toggle Button */}
            <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <FiX className="close-icon" /> : <FiMenu className="menu-icon" />}
            </button>

            {/* Navbar Links */}
            <div className={`floating-navbar ${isOpen ? "show" : "hide"}`}>
                <Nav className="nav-links">
                    <Nav.Link href="/dashboard/home" className={`nav-item ${location.pathname === "/dashboard/home" ? "active" : ""}`}>
                        <HouseDoor className="icon" />
                        <span>Home</span>
                    </Nav.Link>
                    <Nav.Link href="/dashboard/student-profile" className={`nav-item ${location.pathname === "/dashboard/student-profile" ? "active" : ""}`}>
                        <PersonCircle className="icon" />
                        <span>Profile</span>
                    </Nav.Link>
                    <Nav.Link href="/dashboard/student-results" className={`nav-item ${location.pathname === "/dashboard/student-results" ? "active" : ""}`}>
                        <BarChart className="icon" />
                        <span>Results</span>
                    </Nav.Link>
                </Nav>
            </div>
        </div>
    );
};

export const TeacherSidebar = () => {
    const { currentUser } = useUser();
    const { is_superuser } = currentUser;
    const [isOpen, setIsOpen] = useState(false);



    const location = useLocation(); // Get current URL

    if (is_superuser) {
        return (
            <div className={`floating-navbar-container ${isOpen ? "open" : ""}`}>
                {/* Toggle Button */}
                <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <FiX className="close-icon" /> : <FiMenu className="menu-icon" />}
                </button>

                {/* Navbar Links */}
                <div className={`floating-navbar ${isOpen ? "show" : "hide"}`}>
                    <Nav className="nav-links">
                        <Nav.Link href="/dashboard/home" className={`nav-item ${location.pathname === "/dashboard/home" ? "active" : ""}`}>
                            <HouseDoor className="icon" />
                            <span>Home</span>
                        </Nav.Link>
                        <Nav.Link href="/dashboard/teacher-profile" className={`nav-item ${location.pathname === "/dashboard/teacher-profile" ? "active" : ""}`}>
                            <PersonCircle className="icon" />
                            <span>Profile</span>
                        </Nav.Link>
                        <Nav.Link href="/dashboard/add-user" className={`nav-item ${location.pathname === "/dashboard/add-user" ? "active" : ""}`}>
                            <PersonPlus className="icon" />
                            <span>Add User</span>
                        </Nav.Link>
                        <Nav.Link href="/dashboard/student-results" className={`nav-item ${location.pathname === "/dashboard/student-results" ? "active" : ""}`}>
                            <BarChart className="icon" />
                            <span>Results</span>
                        </Nav.Link>
                        <Nav.Link href="/dashboard/subjects" className={`nav-item ${location.pathname === "/dashboard/subjects" ? "active" : ""}`}>
                            <Book className="icon" />
                            <span>Subjects</span>
                        </Nav.Link>
                        <Nav.Link href="/dashboard/classrooms" className={`nav-item ${location.pathname === "/dashboard/classrooms" ? "active" : ""}`}>
                            <Building className="icon" />
                            <span>Classrooms</span>
                        </Nav.Link>
                        <Nav.Link href="/dashboard/migrate-students" className={`nav-item ${location.pathname === "/dashboard/migrate-students" ? "active" : ""}`}>
                            <Calendar2Event className="icon" />
                            <span>Migrate</span>
                        </Nav.Link>
                    </Nav>
                </div>
            </div>
        );
    } else {
        return (
            <div className={`floating-navbar-container ${isOpen ? "open" : ""}`}>
                {/* Toggle Button */}
                <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <FiX className="close-icon" /> : <FiMenu className="menu-icon" />}
                </button>

                {/* Navbar Links */}
                <div className={`floating-navbar ${isOpen ? "show" : "hide"}`}>
                    <Nav className="nav-links">
                        <Nav.Link href="/dashboard/home" className={`nav-item ${location.pathname === "/dashboard/home" ? "active" : ""}`}>
                            <HouseDoor className="icon" />
                            <span>Home</span>
                        </Nav.Link>
                        <Nav.Link href="/dashboard/teacher-profile" className={`nav-item ${location.pathname === "/dashboard/teacher-profile" ? "active" : ""}`}>
                            <PersonCircle className="icon" />
                            <span>Profile</span>
                        </Nav.Link> 
                        <Nav.Link href="/dashboard/subjects" className={`nav-item ${location.pathname === "/dashboard/subjects" ? "active" : ""}`}>
                            <Book className="icon" />
                            <span>Subjects</span>
                        </Nav.Link>
                        <Nav.Link href="/dashboard/classrooms" className={`nav-item ${location.pathname === "/dashboard/classrooms" ? "active" : ""}`}>
                            <Building className="icon" />
                            <span>Classrooms</span>
                        </Nav.Link>
                    </Nav>
                </div>
            </div>
        );
    }

}
