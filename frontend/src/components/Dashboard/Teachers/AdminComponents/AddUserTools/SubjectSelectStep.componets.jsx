import { useState, useEffect } from "react";
import { Card, Col, Row, Button, Badge, Alert } from 'react-bootstrap';
import { FaBookOpen, FaUser, FaUsers } from 'react-icons/fa';
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
                setTerm(classroomName);
                handleSearch();
            })
    }
    useEffect(() => {
        fetchClassSubject();
    })
    return (
        <div className="p-4 bg-light rounded shadow-sm">
            <h3 className="mb-4 text-center">Select Subjects</h3>

            {selectionError && <Alert variant="danger" dismissible>{selectionError}</Alert>}

            <Row className="g-4">
                {loading && <CenteredSpinner caption="Fetching Subjects..." />}

                {isError && (
                    <ErrorAlert
                        heading="Error while fetching subjects"
                        message={ErrorMessageHandling(isError, error)}
                        removable={true}
                    />
                )}

                {!loading && !isError && subjects.length === 0 && (
                    <p className="text-center">No subjects found!</p>
                )}

                {!loading && !isError && subjects.map(({ id, name, students_offering, assigned_teacher }) => (
                    <Col md={4} key={id}>
                        <Card
                            className={`subject-card text-center shadow-sm ${classSubjects.includes(id) ? 'selected' : ''}`}
                            onClick={() => toggleSelectSubject(id)}
                        >
                            <Card.Body>
                                <div className="icon-container">
                                    <FaBookOpen size={30} className="mb-2" />
                                </div>
                                <Card.Title>{name}</Card.Title>
                                <Card.Text>
                                    <FaUser className="me-2" />
                                    <strong>Teacher:</strong> {assigned_teacher ? assigned_teacher.username.replace('_', ' ') : 'None'}
                                </Card.Text>
                                <Card.Text>
                                    <FaUsers className="me-2" />
                                    <strong>Students:</strong> <Badge bg="primary">{students_offering.length}</Badge>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-between align-items-center my-4">
                <Button onClick={goToPrevPage} disabled={!prevPage}>
                    Previous
                </Button>
                <span>Page {currentPage}</span>
                <Button onClick={goToNextPage} disabled={!nextPage}>
                    Next
                </Button>
            </div>

            {/* Unselect All Button */}
            {classSubjects.length > 0 && (
                <div className="text-center mt-3">
                    <Button variant="danger" onClick={unselectAll}>Unselect All</Button>
                </div>
            )}

            {/* Footer */}
            <div className="d-flex justify-content-between  footer mt-4">
                <Button variant="secondary" onClick={prevStep}>Back</Button>
                <Button variant="primary" onClick={handleSubmit}>Confirm</Button>
            </div>
        </div>
    )
}