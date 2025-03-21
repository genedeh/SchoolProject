import { useState } from "react";
import  useClassrooms  from "../../../../../contexts/Classrooms.contexts";
import { Button, Badge, Row, Col, Card, Alert, InputGroup, Form } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
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
            <h3 className="mb-4 text-center">Classroom List {`(${selectedClassRoomName})`}
            </h3>
            <br />
            {selectionError && <Alert variant="danger" dismissible>{selectionError}</Alert>}
            <InputGroup>
                <Form.Control className="me-auto " placeholder='Search...' value={searchTerm} onChange={(e) => {
                    setSearchTerm(e.target.value)
                }} />
                <Button variant='outline-primary' onClick={() => {
                    setTerm(searchTerm);
                    handleSearch();
                }}>
                    <Search className='me-2' />
                </Button>
            </InputGroup>
            <hr />
            <Row className="g-3">
                {loading && <CenteredSpinner caption="Fetching Classrooms..." />}
                {isError && <ErrorAlert heading="Error while fetching classrooms" message={ErrorMessageHandling(isError, error)} removable={true} />}
                {!loading && !isError && classrooms.length === 0 && (
                    <p>No classrooms found!</p>
                )}
                {!loading && !isError && classrooms.length > 0 && (
                    classrooms?.map(({ id, students, assigned_teacher, name }) => (
                        <Col key={id} md={12}>
                            <Card
                                key={id}
                                onClick={() => toggleSelectClassroom(id)}
                                className={`p-3 
                            ${selectedClassRoom === id ? 'border-primary' : ''}`}
                            >
                                <Card.Body>
                                    <Card.Title className="text-center">{name}</Card.Title>
                                    <Card.Text>
                                        Assigned Teacher : {assigned_teacher ? (assigned_teacher.username.replace('_', ' ')) : ("NO ASSIGNE TEACHER")}
                                    </Card.Text>
                                    <Card.Text>
                                        No Of Students : <Badge bg="primary">{students.length}</Badge>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}

                <div className="d-flex justify-content-between align-items-center my-4">
                    <Button onClick={goToPrevPage} disabled={!prevPage}>
                        Previous
                    </Button>
                    <span>Page {currentPage}</span>
                    <Button onClick={goToNextPage} disabled={!nextPage}>
                        Next
                    </Button>
                </div>
            </Row>

            <div className="d-flex justify-content-between mt-4">
                <Button variant="secondary" onClick={prevStep}>
                    Back
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Confirm
                </Button>
            </div>
        </div>
    );
};