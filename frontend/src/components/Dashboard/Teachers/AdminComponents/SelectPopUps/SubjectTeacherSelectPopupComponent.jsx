import { Modal, Button, ListGroup, Pagination, Form, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
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

    const response = await axios.get(`/api/quick_users_view/?T=&page=${page}&username=${query.replace(/ /g, "")}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        });
    return response.data;
};

export const TeacherSelectPopUp = ({ show, handleClose, selectedTeacher, setSelectedTeacher }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const [searchTerm, setSearchTerm] = useState("");
    const [tempSearchTerm, setTempSearchTerm] = useState("");


    const { data,
        isLoading,
        isError,
        error } = useQuery(['subject-teachers', currentPage, show, searchTerm], () => fetchData(currentPage, searchTerm),
            {
                refetchOnWindowFocus: false, // Refetch when window is focused
                retry: 3,                   // Retry fetching up to 3 times
                keepPreviousData: false,    // Prevents stale data display
            });

    return (
        <Modal show={show} size="lg" fullscreen scrollable onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Teachers</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup>
                    <Form.Select className="me-2">
                        <option value="">{!selectedTeacher ? ("Select a Teacher") : (selectedTeacher.username)}</option>
                    </Form.Select>
                    <Form.Control className="me-auto " placeholder='Search...' value={tempSearchTerm} onChange={(e) => {
                        setTempSearchTerm(e.target.value)
                    }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setCurrentPage(1);
                                setSearchTerm(tempSearchTerm);
                            }
                        }}
                    />
                    <Button variant='outline-primary'
                        className='custom-btn'
                        onClick={() => {
                            setCurrentPage(1);
                            setSearchTerm(tempSearchTerm);
                        }}>
                        <Search className='me-2' />
                    </Button>
                </InputGroup>

                {isError && <ErrorAlert heading="Error While trying to fetch classrooms" message={ErrorMessageHandling(isError, error)} removable={true} />}
                <ListGroup className="mb-3 ">
                    {!isLoading && !isError ?
                        (data.results?.map((teacher) => (
                            <UserCardItemComponent key={teacher.id} user={teacher} clickHandler={setSelectedTeacher} selectedDisplay={selectedTeacher ? (selectedTeacher.id === teacher.id ? 'border-info' : '') : ("")} />
                        ))) : (
                            <>
                                <CenteredSpinner caption='Fetching Teachers...' />
                            </>
                        )}

                </ListGroup>

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
