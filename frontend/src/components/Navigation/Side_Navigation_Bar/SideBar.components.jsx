import { Nav, Navbar } from 'react-bootstrap';
import { House, BarChart, PersonAdd, Calendar2Event, BookHalf, PersonCircle, SuitClub } from 'react-bootstrap-icons';
import './SideBar.styles.css'
import { useUser } from '../../../contexts/User.contexts';

export const StudentSidebar = () => {
    return (
        <Navbar collapseOnSelect expand="lg" fluid="true" className="d-flex flex-column  bg-light container" >
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="flex-column" coll="true">
                    <Navbar.Brand style={{ 'color': 'blue' }}>Dashboard</Navbar.Brand>
                    <Nav.Item>
                        <Nav.Link href='/dashboard/home'><House className="me-2" /> Home</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href='/dashboard/student-profile'><PersonCircle className="me-2" /> Profile</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/dashboard/student-results"><BarChart className="me-2" /> Results </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export const TeacherSidebar = () => {
    const { currentUser } = useUser();
    const { is_superuser } = currentUser;
    if (is_superuser) {
        return (
            <Navbar collapseOnSelect expand="lg" fluid="true" className="d-flex flex-column  bg-light container" >
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="flex-column" coll="true">
                        <Navbar.Brand style={{ 'color': 'blue' }}>Dashboard</Navbar.Brand>
                        <Nav.Item>
                            <Nav.Link href='/dashboard/home'><House className="me-2" /> Home</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href='/dashboard/teacher-profile'><PersonCircle className="me-2" /> Profile</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="/dashboard/add-user"><PersonAdd className="me-2" /> Add User  </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="/dashboard/student-results"><BarChart className="me-2" /> Results  </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="/dashboard/migrate-students"><Calendar2Event className="me-2" /> Migrate Students  </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="/dashboard/subjects"><BookHalf className="me-2" /> Subjects  </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="/dashboard/classrooms"><SuitClub className="me-2" /> ClassRooms </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    } else {
        return (
            <Navbar collapseOnSelect expand="lg" fluid="true" className="d-flex flex-column  bg-light container" >
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="flex-column" coll="true">
                        <Navbar.Brand style={{ 'color': 'blue' }}>Dashboard</Navbar.Brand>
                        <Nav.Item>
                            <Nav.Link href='/dashboard/home'><House className="me-2" /> Home</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href='/dashboard/teacher-profile'><PersonCircle className="me-2" /> Profile</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="/dashboard/subjects"><BookHalf className="me-2" /> Subject  </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="/dashboard/classrooms"><SuitClub className="me-1" /> Your ClassRoom </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }

}
