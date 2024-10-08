import { useContext, useState } from "react";
import { ClassroomsContext } from "../../../../../contexts/Classrooms.contexts";
import { Button, Badge, Alert, Row, Col, Card, InputGroup, Form } from "react-bootstrap";

export const ClassSelectStep = ({ formData, updateFormData, nextStep, prevStep }) => {
    const { classrooms, goToPrevPage, goToNextPage, currentPage, nextPage, prevPage, setTerm } = useContext(ClassroomsContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);
    const [selectedClassRoom, setSelectedClassRoom] = useState(formData.classes[0]);
    const toggleSelectClassroom = (id) => {
        setSelectedClassRoom(id)
        updateFormData('classes', [id])
    };

    const handleSubmit = (e) => {
        if (formData.classes.length !== 0) {
            setError(null);
            nextStep();
        } else {
            setError('Select A Class');
        }
    }

    return (
        <div className="p-4 bg-light rounded shadow-sm">
            <h3 className="mb-4 text-center">Classroom List {`(${classrooms.filter(classroom => classroom.id == selectedClassRoom)[0] ?
                (classrooms.filter(classroom => classroom.id == selectedClassRoom)[0].name)
                :
                ("")})`}
            </h3>
            {error && <Alert variant="danger" dismissible>{error}</Alert>}
            <InputGroup>
                <Form.Control className="m-4" size="sm" placeholder='Enter Classroom Name...' value={searchTerm} onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setTerm(e.target.value)
                }} />
            </InputGroup>
            <Row className="g-3">
                {classrooms.map((classroom) => (
                    <Col key={classroom.id} md={12}>
                        <Card
                            key={classroom.id}
                            onClick={() => toggleSelectClassroom(classroom.id)}
                            className={`p-3 
                            ${selectedClassRoom === classroom.id ? 'border-primary' : ''}`}
                        >
                            <Card.Body>
                                <Card.Title className="text-center">{classroom.name}</Card.Title>
                                <Card.Text>
                                    Assigned Teacher : {classroom.assigned_teacher ? (classroom.assigned_teacher.username.replace('_', ' ')) : ("NO ASSIGNE TEACHER")}
                                </Card.Text>
                                <Card.Text>
                                    No Of Students : <Badge bg="primary">{classroom.students.length}</Badge>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
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