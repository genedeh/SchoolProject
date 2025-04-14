import { Modal, Button, ListGroup, Pagination, Form, InputGroup } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Search } from 'react-bootstrap-icons';
import axios from "axios";
import { ErrorAlert } from '../../../../Alerts/ErrorAlert.components';
import { ErrorMessageHandling } from '../../../../../utils/ErrorHandler.utils'
import { UserCardItemComponent } from './UserCardItem.components';
import { CenteredSpinner } from "../../../../Loading/CenteredSpinner.components";

const fetchData = async (page, query) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Authentication token is missing!");
    }

    const response = await axios.get(`/api/quick_users_view/?N&S=&page=${page}&username=${query.replace(/ /g, "")}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        });
    return response.data;
};

export const ClassroomStudentsSelectPopUp = ({ show, handleClose, selectedStudents, setSelectedStudents }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [tempSearchTerm, setTempSearchTerm] = useState("");
    const [searchTerm, setSearchTerm] = useState("")



    const { data,
        isLoading,
        isError,
        error } = useQuery(['classroom-students', currentPage, show, searchTerm], () => fetchData(currentPage, searchTerm),
            {
                refetchOnWindowFocus: false, // Refetch when window is focused
                retry: 3,                   // Retry fetching up to 3 times
                keepPreviousData: false,    // Prevents stale data display
            });

    useEffect(() => {
        if (show) {
            const StudentIds = selectedStudents.map(student => student.id)
            setSelectedOptions(StudentIds)
        }

    }, [show]);

    return (
        <Modal show={show} size="lg" fullscreen scrollable onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Students</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup>
                    <Form.Select className="me-2" >
                        <option value="">Choosen Students</option>
                        {selectedOptions.map((id) => {
                            const student = selectedStudents.find((student) => student.id === id);
                            return student ? (
                                <option key={id} value={student.username}>
                                    {student.username}
                                </option>
                            ) : null;
                        })}
                    </Form.Select>
                    <Form.Control className="me-auto " placeholder='Search...' value={tempSearchTerm} onChange={(e) => {
                        setTempSearchTerm(e.target.value)
                    }} />
                    <Button variant='outline-primary'
                        className="custom-btn"
                        onClick={() => {
                        setCurrentPage(1);
                        setSearchTerm(tempSearchTerm);
                    }}>
                        <Search className='me-2' />
                    </Button>
                </InputGroup>

                {isError && <ErrorAlert heading="Error While trying to fetch classrooms" message={ErrorMessageHandling(isError, error)} removable={true} />}
                <ListGroup className="mb-3 ">
                    {!isError &&
                        !isLoading ?
                        (data.results?.map((student) => (
                            <UserCardItemComponent key={student.id} user={student} clickHandler={() => {
                                if (!selectedOptions.includes(student.id)) {
                                    setSelectedOptions([...selectedOptions, student.id])
                                    setSelectedStudents(selectedStudents => [...selectedStudents, student]);
                                } else {
                                    const removeStudentId = selectedOptions.filter(id => id !== student.id);
                                    setSelectedOptions(removeStudentId)
                                    const removeStudent = selectedStudents.filter(selectedStudent => selectedStudent.id !== student.id);
                                    setSelectedStudents(removeStudent)
                                }
                            }} selectedDisplay={selectedOptions.includes(student.id) ? 'border-info' : ''} />
                        ))) : (
                            <>
                                <CenteredSpinner caption="Fetching Students..." />
                            </>
                        )
                    }

                </ListGroup>
                {/* Pagination */}


            </Modal.Body>
            <Modal.Footer>
                <Pagination className="justify-content-center">
                    <Pagination.Prev
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    />
                    <Pagination.Item active>{currentPage}</Pagination.Item>
                    <Pagination.Next
                        disabled={currentPage === Math.ceil(data?.count / usersPerPage)}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                    />
                </Pagination>
                <Button variant="outline-primary" onClick={handleClose}>
                    Done
                </Button>
            </Modal.Footer>
        </Modal>
    );
};