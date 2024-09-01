import { Nav, Navbar, Badge } from 'react-bootstrap';
import { House, Book, Envelope, BarChart, Award, PersonAdd, Calendar2Event, BookHalf, PersonCircle, SuitClub } from 'react-bootstrap-icons';
import './SideBar.styles.css'
import { useContext } from 'react';
import { UserContext } from '../../../contexts/User.contexts';

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
                        <Nav.Link href="#homework"><Book className="me-2" /> Homework <Badge bg="secondary" className='visually-hidden'>{0}</Badge></Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="#events"><Calendar2Event className="me-2" /> Events <Badge bg="secondary" className='visually-hidden'>{0}</Badge></Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="#achivements"><Award className="me-1" /> Achievements <Badge bg="secondary" className='visually-hidden'>{0}</Badge></Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="#results"><BarChart className="me-2" /> Results <Badge bg="secondary" className='visually-hidden'>{0}</Badge></Nav.Link>
                    </Nav.Item>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export const TeacherSidebar = () => {
    const { currentUser } = useContext(UserContext);
    const { is_admin } = currentUser;
    if (is_admin) {
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
                            <Nav.Link href="/dashboard/add-user"><PersonAdd className="me-2" /> Add User <Badge bg="secondary" className='visually-hidden'>{0}</Badge></Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#alerts"><Envelope className="me-2" /> Alerts <Badge bg="secondary" className='visually-hidden'>{0}</Badge></Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#results"><BarChart className="me-2" /> Results <Badge bg="secondary" className='visually-hidden'>{0}</Badge></Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#events"><Calendar2Event className="me-2" /> Events <Badge bg="secondary" className='visually-hidden'>{0}</Badge></Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="/dashboard/subjects"><BookHalf className="me-2" /> Subjects <Badge bg="secondary" className='visually-hidden'>{0}</Badge></Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#classrooms"><SuitClub className="me-2" /> ClassRooms <Badge bg="secondary" className='visually-hidden'>{0}</Badge></Nav.Link>
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
                            <Nav.Link href="#alerts"><Envelope className="me-2" /> Alerts <Badge bg="secondary" className='visually-hidden'>{0}</Badge></Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#results"><BarChart className="me-2" /> Class Results <Badge bg="secondary" className='visually-hidden'>{0}</Badge></Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#events"><Calendar2Event className="me-2" /> Events <Badge bg="secondary" className='visually-hidden'>{0}</Badge></Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="/dashboard/subjects"><BookHalf className="me-2" /> Subject <Badge bg="secondary" className='visually-hidden'>{0}</Badge></Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#classroom"><SuitClub className="me-1" /> Your ClassRoom <Badge bg="secondary" className='visually-hidden'>{0}</Badge></Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }

}
