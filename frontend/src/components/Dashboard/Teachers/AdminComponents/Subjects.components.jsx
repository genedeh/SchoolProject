import { useContext, useState } from "react";
import { UserContext } from "../../../../contexts/User.contexts";
import { Navigate } from "react-router-dom";
import { SubjectsContext } from "../../../../contexts/Subjects.contexts";
import { Accordion, Card, Button, ListGroup, Modal, Container, Spinner, Row, Col } from 'react-bootstrap';
import { Trash, PersonAdd, ReplyAll, Plus } from 'react-bootstrap-icons';
import axios from "axios";

const DeleteSubjectModal = ({ show, handleClose, subjectId }) => {
    const [deleteStatus, setDeleteStatus] = useState(null);
    const { subjects, setSubjects } = useContext(SubjectsContext);

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/subjects/${subjectId}/`);
            console.log(response.data)
            setDeleteStatus("success");
            setSubjects(subjects.filter(subject => subject.id !== subjectId));
        } catch (error) {
            setDeleteStatus("failed");
        }
    };


    return (
        <>
            <Modal show={show} onHide={() => {
                handleClose()
                setDeleteStatus(null);
            }}>
                {deleteStatus == null ?
                    (
                        <>
                            <Modal.Header closeButton>
                                <Modal.Title>Delete Subject</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Are you sure you want to delete this subject?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button variant="danger" onClick={handleDelete}>
                                    Delete
                                </Button>
                            </Modal.Footer>
                        </>) :
                    (<>
                        <Modal.Header closeButton>
                            <Modal.Title>{deleteStatus === "success" ? "Success" : "Error"}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {deleteStatus === "success"
                                ? "The subject was deleted successfully."
                                : "Failed to delete the subject."}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={() => {
                                handleClose()
                                setDeleteStatus(null);
                            }}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </>)}

            </Modal>

            {/* <Modal show={deleteStatus !== null} onHide={() => setDeleteStatus(null)}>

            </Modal> */}
        </>
    );
};


export const Subjects = () => {
    const { currentUser } = useContext(UserContext);
    const { subjects } = useContext(SubjectsContext);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);


    const handleDeleteClick = (subjectId) => {
        setSelectedSubjectId(subjectId);
        setShowDeleteModal(true);
    };

    if (!currentUser.is_student_or_teacher && currentUser && currentUser.is_admin) {
        if (subjects.length !== 0) {
            return (
                <>
                    <div className="d-grid gap-2 m-2">
                        <Button variant="outline-primary" size="lg" >
                            <Plus/>
                        </Button>
                    </div>
                    <Accordion flush={true} className="m-3">
                        {subjects.map(({ assigned_teacher, id, name, students_offering }) => (
                            <Card key={id} className="mb-2">
                                <Accordion.Item eventKey={id.toString()}>
                                    <Accordion.Header eventKey={id.toString()} className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5>{name.replace('_', ' ')}</h5>
                                            <small className="text-muted">Teacher: {assigned_teacher ? (assigned_teacher.username.replace('_', ' ')) : ("NO ASSIGNED TEACHER")}</small>
                                        </div>

                                    </Accordion.Header>
                                    <Button className="m-4" variant="outline-danger" onClick={() => handleDeleteClick(id)} ><Trash /></Button>
                                    <Button className="m-4" variant="outline-primary" onClick={() => handleDeleteClick(id)} ><PersonAdd /></Button>
                                    <Button className="m-4" variant="outline-info" onClick={() => handleDeleteClick(id)} ><ReplyAll /></Button>
                                    <Accordion.Body>
                                        <ListGroup>
                                            {students_offering.length !== 0 ? (students_offering.map((student) => (
                                                <ListGroup.Item key={student.id}>
                                                    {student.username.replace('_', ' ')} ---- {student.gender.toUpperCase()}
                                                </ListGroup.Item>
                                            ))) : ('NO Student Available')}
                                        </ListGroup>
                                    </Accordion.Body>
                                </Accordion.Item>

                            </Card>
                        ))}
                    </Accordion>
                    <DeleteSubjectModal
                        show={showDeleteModal}
                        handleClose={() => setShowDeleteModal(false)}
                        subjectId={selectedSubjectId}
                    />
                </>
            );
        } else {
            return (<Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>)
        }
    } return (
        <Navigate to='/dashboard/home' />
    );
}