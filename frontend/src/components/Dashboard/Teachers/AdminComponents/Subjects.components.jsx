import { useContext, useState } from "react";
import { UserContext } from "../../../../contexts/User.contexts";
import { SubjectsContext } from "../../../../contexts/Subjects.contexts";
import { Navigate } from "react-router-dom";
import { Accordion, Card, Button, ListGroup, Spinner } from 'react-bootstrap';
import { Trash, Pencil, Plus } from 'react-bootstrap-icons';
import { DeleteSubjectModal } from "./SubjectTools/DeleteSubject.components";
import { CreateSubjectModal } from "./SubjectTools/CreateSubject.components";
import { UpdateSubjectModal } from "./SubjectTools/UpdateSubject.components";

export const Subjects = () => {
    const { currentUser } = useContext(UserContext);
    const { subjects } = useContext(SubjectsContext);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [selectedSubjectForUpdate, setSelectedSubjectForUpdate] = useState(null);


    const handleCreateShowModal = () => setShowCreateModal(true);
    const handleCreateCloseModal = () => setShowCreateModal(false);
    const handleUpdateCloseModal = () => setShowUpdateModal(false);

    const handleDeleteClick = (subjectId) => {
        setSelectedSubjectId(subjectId);
        setShowDeleteModal(true);
    };
    const handleUpdateClick = (subjectId) => {
        subjects.map((subject) => {
            if (subject.id === subjectId) {
                const subjectClone = { ...subject }
                const newStudents = []
                subjectClone.students_offering.map((stundent) => {
                    newStudents.push(stundent.id)
                })
                subjectClone['students_offering'] = newStudents
                setSelectedSubjectForUpdate(subjectClone)
            }
        })
        setShowUpdateModal(true)
    }

    if (!currentUser.is_student_or_teacher && currentUser && currentUser.is_admin) {
        if (subjects.length !== 0) {
            return (
                <>
                    <div className="d-grid gap-2 m-2">
                        <Button variant="outline-primary" size="lg" onClick={handleCreateShowModal} >
                            <Plus />
                        </Button>
                    </div>
                    <Accordion flush={true} className="m-3">
                        {subjects.map(({ assigned_teacher, id, name, students_offering }) => (
                            <Card key={id} className="mb-2">
                                <Accordion.Item eventKey={id}>
                                    <Accordion.Header eventKey={id} className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5>{name.replace('_', ' ')}</h5>
                                            <small className="text-muted">Teacher: {assigned_teacher ? (assigned_teacher.username.replace('_', ' ')) : ("NO ASSIGNED TEACHER")}</small>
                                        </div>

                                    </Accordion.Header>
                                    <Button className="m-4" variant="outline-danger" onClick={() => handleDeleteClick(id)} ><Trash /></Button>
                                    <Button className="m-4" variant="outline-info" onClick={() => handleUpdateClick(id)} ><Pencil /></Button>
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
                    <CreateSubjectModal show={showCreateModal} handleClose={handleCreateCloseModal} />
                    <UpdateSubjectModal show={showUpdateModal} handleClose={handleUpdateCloseModal} subject={selectedSubjectForUpdate} />
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