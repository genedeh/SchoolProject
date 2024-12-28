import { Modal, Button, ListGroup, Pagination, Form, InputGroup } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { LoadingOverlay } from '../../../../Loading/LoadingOverlay.components'
import { Search } from 'react-bootstrap-icons';
import { ErrorAlert } from '../../../../Alerts/ErrorAlert.components';
import axios from "axios";

export const ClassRoomTeacherSelectPopUp = ({ show, handleClose, selectedTeacher, setSelectedTeacher }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 2;
    const [totalUsers, setTotalUsers] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [tempSearchTerm, setTempSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTeachers = async (page = 1) => {
        const token = localStorage.getItem("token")
        if (token) {
            await axios.get(`/api/quick_users_view/?N=&T=&page=${page}&username=${searchTerm.replace(/ /g, "")}`)
                .then(respone => {
                    const data = respone.data;
                    setTotalUsers(data.count)
                    const newData = data.results.filter((user) => {
                        if (!user.is_student_or_teacher) {
                            return user
                        }
                    })
                    setUsers(newData);
                    setLoading(false)
                    console.log("Loading DOne")
                }).catch(e => {
                    if (e.response.data["detail"] == "Invalid page.") {
                        setCurrentPage(1)
                        fetchTeachers();
                    }
                })
        }
    }


    // Pagination logic
    useEffect(() => {
        if (show) {
            setLoading(true)
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
                <InputGroup>
                    <Form.Select className="me-2">
                        <option value="">{!selectedTeacher ? ("Select a Teacher"):(selectedTeacher.username)}</option>
                    </Form.Select>
                    <Form.Control className="me-auto " placeholder='Search...' value={tempSearchTerm} onChange={(e) => {
                        setTempSearchTerm(e.target.value)
                    }} />
                    <Button variant='outline-primary' onClick={() => setSearchTerm(tempSearchTerm)}>
                        <Search className='me-2' />
                    </Button>
                </InputGroup>

                <ListGroup className="mb-3 ">
                    {loading ? (
                        <LoadingOverlay loading={loading} message='Fetching Teachers...' />
                    ) : (users.length !== 0 ?
                        (users.map((teacher) => (
                            <ListGroup.Item key={teacher.id} className={`d-flex justify-content-between align-items-center container 
                            ${selectedTeacher ? (selectedTeacher.id == teacher.id ? 'border-info' : '') : ("")}`}
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
                        ))) : (<ErrorAlert heading={"404 Not Found"} message={`${searchTerm} is not a valid teacher...`} removable={true} />)

                    )}

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
