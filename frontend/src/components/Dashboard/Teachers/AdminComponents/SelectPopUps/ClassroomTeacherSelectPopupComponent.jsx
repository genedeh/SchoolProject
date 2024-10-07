import { Modal, Button, ListGroup, Pagination, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from "axios";

export const ClassRoomTeacherSelectPopUp = ({ show, handleClose, selectedTeacher, setSelectedTeacher }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 2;
    const [totalUsers, setTotalUsers] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);


    const fetchTeachers = async (page = 1) => {
        const token = localStorage.getItem("token")
        if (token) {
            await axios.get(`/api/quick_users_view/?N=&T=&page=${page}&username=${searchTerm}`)
                .then(respone => {
                    const data = respone.data;
                    setTotalUsers(data.count)
                    const newData = data.results.filter((user) => {
                        if (!user.is_student_or_teacher) {
                            return user
                        }
                    })
                    setUsers(newData);
                })

        }
    }


    // Pagination logic
    useEffect(() => {
        if (show) {
            fetchTeachers(currentPage);
        }
    }, [currentPage, searchTerm, show]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Modal show={show} size="lg" fullscreen scrollable onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Teachers</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Control className="me-auto mb-3" placeholder='Search...' value={searchTerm} onChange={(e) => {
                    setSearchTerm(e.target.value)
                }} />

                <ListGroup className="mb-3 ">
                    {users.map((teacher) => (
                        <ListGroup.Item key={teacher.id} className={`d-flex justify-content-between align-items-center container 
                            ${selectedTeacher ? ( selectedTeacher.id == teacher.id ? 'border-info' : '' ):("") }`}
                            onClick={() => {
                                setSelectedTeacher(teacher);
                            }}>
                            <div className="d-flex align-items-center">
                                <div className="me-3">
                                    <img
                                        src={teacher.profile_picture == null ? ("https://via.placeholder.com/40") : (teacher.profile_picture)}
                                        className="rounded-circle"
                                        style={{ width: '40px', height: '40px' }}
                                    />
                                </div>
                                <div>
                                    <div>{teacher.username}</div>
                                    <div className="text-muted">{teacher.gender}</div>
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>

                {/* Pagination */}


            </Modal.Body>
            <Modal.Footer>
                <Pagination className='me-5'>
                    {Array.from({ length: Math.ceil(totalUsers / usersPerPage) }, (_, index) => (
                        <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                            {index + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
                <Button variant="outline-primary" onClick={handleClose}>
                    Done
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
