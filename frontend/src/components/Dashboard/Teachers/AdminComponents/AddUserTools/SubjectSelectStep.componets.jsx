import { useState, useContext, useEffect } from "react";
import { Button, Row, Col, Card, Badge, Alert } from "react-bootstrap";
import { SubjectsContext } from "../../../../../contexts/Subjects.contexts";
import { ClassroomsContext } from "../../../../../contexts/Classrooms.contexts";
import axios from "axios";

const getRandomColor = () => {
    const colors = ['#f28b82', '#fbbc04', '#34a853', '#4285f4', '#a142f4', '#f54842'];
    return colors[Math.floor(Math.random() * colors.length)];
};

export const SubjectSelectStep = ({ formData, updateFormData, nextStep, prevStep }) => {
    const { subjects, goToPrevPage, goToNextPage, currentPage, nextPage, prevPage, setTerm } = useContext(SubjectsContext);
    const { classrooms } = useContext(ClassroomsContext);
    const [error, setError] = useState(null);
    const [classSubjects, setClassSubjects] = useState(formData.subjects || []);
    const [availableSubjects, setAvailableSubjects] = useState([]);

    const toggleSelectSubject = (id) => {
        setClassSubjects((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter((item) => item !== id) : [...prevSelected, id]
        );
    };

    const unselectAll = () => {
        setClassSubjects([]);
    };

    const handleSubmit = () => {
        if (classSubjects.length !== 0) {
            setError(null);
            updateFormData('subjects', classSubjects)
            nextStep();
        } else {
            setError('Select Subjects');
        }
    }

    const fetchClassSubject = async () => {
        await axios.get(`/api/classrooms/${formData.classes[0]}`)
            .then(async response => {
                const classroomName = response.data["name"]
                setTerm(classroomName)
            })
    }
    useEffect(() => {
        fetchClassSubject();
    }, [currentPage])
    return (
        <>
            <div className="p-4 bg-light rounded shadow-sm">
                <h3 className="mb-4 text-center">Subjects List</h3>
                {error && <Alert variant="danger" dismissible>{error}</Alert>}
                <Row className="g-3">
                    {subjects.map(({ id, students_offering, assigned_teacher, name }) => (
                        <Col key={id} md={12}>
                            <Card
                                key={id}
                                onClick={() => toggleSelectSubject(id)}
                                className={`p-3 
                            ${classSubjects.includes(id) ? 'border-primary' : ''}`}
                            >
                                <Card.Body>
                                    <Card.Title className="text-center">{name}</Card.Title>
                                    <Card.Text>
                                        Assigned Teacher : {assigned_teacher ? (assigned_teacher.username.replace('_', ' ')) : ("NO ASSIGNE TEACHER")}
                                    </Card.Text>
                                    <Card.Text>
                                        No Of Students : <Badge bg="primary">{students_offering.length}</Badge>
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
                {/* Unselect All Button */}
                {classSubjects.length > 0 && (
                    <Button variant="danger" className="mt-3" onClick={unselectAll}>
                        Unselect All
                    </Button>
                )}
            </div>
            <div className="d-flex justify-content-between mt-4">
                <Button variant="secondary" onClick={prevStep}>
                    Back
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Confirm
                </Button>
            </div>
        </>
    )
}