import { useState } from "react";
import  useClassrooms  from "../../../../../contexts/Classrooms.contexts";
import { Card, Col, Row, Button, Badge, Alert, InputGroup, Form } from 'react-bootstrap';
import { FaChalkboardTeacher, FaUserGraduate, FaSearch } from 'react-icons/fa';
import { ErrorMessageHandling } from "../../../../../utils/ErrorHandler.utils";
import { ErrorAlert } from "../../../../Alerts/ErrorAlert.components";
import CenteredSpinner from "../../../../Loading/CenteredSpinner.components";

export const ClassSelectStep = ({ formData, updateFormData, nextStep, prevStep }) => {
    const { classrooms, goToPrevPage, goToNextPage, currentPage, nextPage, prevPage, setTerm, loading, isError, error, handleSearch } = useClassrooms();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectionError, setSelectionError] = useState(null);
    const [selectedClassRoom, setSelectedClassRoom] = useState(formData.classes[0]);
    const [selectedClassRoomName, setSelectedClassRoomName] = useState("");
    const toggleSelectClassroom = (id) => {
        setSelectedClassRoom(id)
        setSelectedClassRoomName(classrooms.filter(classroom => classroom.id === id)[0] &&
            (classrooms.filter(classroom => classroom.id === id)[0].name))
        updateFormData('classes', [id])
    };

    const handleSubmit = (e) => {
        if (formData.classes.length !== 0) {
            setSelectionError(null);
            nextStep();
        } else {
            setSelectionError('Select A Class');
        }
    }

    return (
        <div className="p-4 bg-light rounded shadow-sm">
            <h3 className="mb-4 text-center">
                Select Classroom <span className="text-primary">({selectedClassRoomName})</span>
            </h3>

            {selectionError && <Alert variant="danger" dismissible>{selectionError}</Alert>}

            <InputGroup className="mb-3">
                <Form.Control
                    placeholder='Search...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant='outline-primary' onClick={() => {
                    setTerm(searchTerm);
                    handleSearch();
                }}>
                    <FaSearch />
                </Button>
            </InputGroup>

            <Row className="g-4">
                {loading && <CenteredSpinner caption="Fetching Classrooms..." />}
                {isError && (
                    <ErrorAlert
                        heading="Error while fetching classrooms"
                        message={ErrorMessageHandling(isError, error)}
                        removable={true}
                    />
                )}

                {!loading && !isError && classrooms.length === 0 && (
                    <p className="text-center">No classrooms found!</p>
                )}

                {!loading && !isError && classrooms.map(({ id, name, assigned_teacher, students }) => (
                    <Col md={4} key={id}>
                        <Card
                            className={`classroom-card text-center shadow-sm ${selectedClassRoom === id ? 'selected' : ''}`}
                            onClick={() => toggleSelectClassroom(id)}
                        >
                            <Card.Body>
                                <div className="icon-container">
                                    <FaChalkboardTeacher size={30} className="mb-2" />
                                </div>
                                <Card.Title>{name}</Card.Title>
                                <Card.Text>
                                    <small>
                                        <strong>Teacher:</strong> {assigned_teacher ? assigned_teacher.username.replace('_', ' ') : 'None'}
                                    </small><br />
                                    <strong>Students:</strong> <Badge bg="primary">{students.length}</Badge>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <div className="d-flex justify-content-between align-items-center my-4">
                <Button onClick={goToPrevPage} disabled={!prevPage}>Previous</Button>
                <span>Page {currentPage}</span>
                <Button onClick={goToNextPage} disabled={!nextPage}>Next</Button>
            </div>

            <div className="d-flex justify-content-between mt-4 footer">
                <Button variant="secondary" onClick={prevStep}>Back</Button>
                <Button variant="primary" onClick={handleSubmit}>Confirm</Button>
            </div>
        </div>
    );
};