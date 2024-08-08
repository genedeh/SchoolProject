import { Nav, Navbar, Badge } from 'react-bootstrap';
import { House, Person,  Book, Envelope, BarChart } from 'react-bootstrap-icons';
import '../Side_Navigation_Bar/SideBar.styles.css'
const StudentSidebar = () => {
    return (
        <div className="d-flex flex-column vh-100 p-3 bg-light container">
            <h4 className="text-primary">Dashboard</h4>
            <Navbar collapseOnSelect expand="lg" fluid>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="flex-column" coll>
                        <Nav.Item>
                            <Nav.Link href='#home'><House className="me-2" /> Home</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href='#profile'><Person className="me-2" /> Profile</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#homework"><Book className="me-2" /> Homework <Badge bg="secondary" className='visually-hidden'>{0}</Badge></Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#messages"><Envelope className="me-2" /> Alerts <Badge bg="secondary" className='visually-hidden'>{0}</Badge></Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#results"><BarChart className="me-2" /> Results <Badge bg="secondary" className='visually-hidden'>{0}</Badge></Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
};

export default StudentSidebar;
