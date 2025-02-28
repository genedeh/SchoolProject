import { useState, useEffect } from "react";
import { Button, Row, Col, Card, Badge, Alert } from "react-bootstrap";
import useSubjects from "../../../../../contexts/Subjects.contexts";
import { CenteredSpinner } from "../../../../Loading/CenteredSpinner.components"
import { ErrorAlert } from "../../../../Alerts/ErrorAlert.components";
import axios from "axios";
import { ErrorMessageHandling } from "../../../../../utils/ErrorHandler.utils";


export const SubjectSelectStep = ({ formData, updateFormData, nextStep, prevStep }) => {
    const { subjects, goToPrevPage, goToNextPage, currentPage, nextPage, prevPage, setTerm, handleSearch, loading, isError, error } = useSubjects();
    const [selectionError, setSelectionError] = useState(null);
    const [classSubjects, setClassSubjects] = useState(formData.subjects || []);

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
            setSelectionError(null);
            updateFormData('subjects', classSubjects)
            nextStep();
        } else {
            setSelectionError('Select Subjects');
        }
    }

    const fetchClassSubject = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Authentication token is missing!");
        }
        handleSearch();
        await axios.get(`/api/classrooms/${formData.classes[0]}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        )
            .then(async response => {
                const classroomName = response.data["name"]
                console.log(classroomName)
                setTerm(classroomName);
                handleSearch();
            })
    }
    useEffect(() => {
        fetchClassSubject();
    }, [])
    return (
        <>
            <div className="p-4 bg-light rounded shadow-sm">
                <h3 className="mb-4 text-center">Subjects List</h3>
                {selectionError && <Alert variant="danger" dismissible>{selectionError}</Alert>}
                <Row className="g-3">
                    {loading && <CenteredSpinner caption="Fetching Subjects..." />}
                    {isError && <ErrorAlert heading="Error while fetching subjects" message={ErrorMessageHandling(isError, error)} removable={true} />}
                    {!loading && !isError && subjects.length === 0 && (
                        <p>No subjects found!</p>
                    )}
                    {!loading && !isError && subjects.length > 0 && (
                        subjects?.map(({ id, students_offering, assigned_teacher, name }) => (
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