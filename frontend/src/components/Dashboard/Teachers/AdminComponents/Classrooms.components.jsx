import { UserContext } from "../../../../contexts/User.contexts";
import { ClassroomsContext } from "../../../../contexts/Classrooms.contexts";
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { Button, Accordion, Card, ListGroup, Spinner } from "react-bootstrap";
import { GenderFemale, GenderMale, Trash, Pencil, PlusCircleFill } from "react-bootstrap-icons";
import { DeleteClassroomModal } from "./ClassroomTools/DeleteClassroom.components";

export const Classrooms = () => {
    const { currentUser } = useContext(UserContext);
    const { classrooms } = useContext(ClassroomsContext);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [selectedSubjectForUpdate, setSelectedSubjectForUpdate] = useState(null);


    const handleDeleteClick = (classId) => {
        setSelectedSubjectId(classId);
        setShowDeleteModal(true);
    };
    const handleUpdateClick = (classId) => { }
    const handleCreateShowModal = () => {};


    if (!currentUser.is_student_or_teacher && currentUser && currentUser.is_admin) {
        if (classrooms.length !== 0) {
            return (
                <>
                    <div className="d-grid gap-2 m-2">
                        <Button variant="outline-primary" size="lg" onClick={handleCreateShowModal} >
                            New classroom <PlusCircleFill />
                        </Button>
                    </div>
                    <Accordion flush={true} className="m-3">
                        {classrooms.map(({ assigned_teacher, id, name, students }) => (
                            <Card key={id} className="mb-2">
                                <Accordion.Item eventKey={id}>
                                    <Accordion.Header eventKey={id} className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5>{name.replace('_', ' ')}</h5>
                                            <small className="text-muted">Teacher: {assigned_teacher ? (assigned_teacher.username.replace('_', ' ')) : ("NO ASSIGNED TEACHER")}</small>
                                        </div>

                                    </Accordion.Header>
                                    <Button style={{ marginLeft: '20px', marginBottom: '10px' }} variant="outline-danger" onClick={() => handleDeleteClick(id)} ><Trash /></Button>
                                    <Button style={{ marginLeft: '20px', marginBottom: '10px' }} variant="outline-info" onClick={() => handleUpdateClick(id)} ><Pencil /></Button>
                                    <Accordion.Body>
                                        <hr /><h5>Students</h5><hr />
                                        <ListGroup>
                                            {students.length !== 0 ? (students.map(({ id, username, gender }) => (
                                                <ListGroup.Item key={id}>
                                                    {username.replace('_', ' ')}
                                                    {gender === 'male' ?
                                                        (<Button className="m-2" size="sm" variant='primary' style={{ 'borderColor': 'white' }}>
                                                            <GenderMale />
                                                        </Button>) :
                                                        (<Button className="m-2" size="sm" style={{ 'backgroundColor': 'pink', 'borderColor': 'white' }}>
                                                            <GenderFemale />
                                                        </Button>)}
                                                </ListGroup.Item>
                                            ))) : ('NO Student Available')}
                                        </ListGroup>
                                    </Accordion.Body>
                                </Accordion.Item>

                            </Card>
                        ))}
                    </Accordion>
                    <DeleteClassroomModal
                        show={showDeleteModal}
                        handleClose={() => setShowDeleteModal(false)}
                        classroomId={selectedSubjectId}
                    />
                </>
            );
        } else {
            return (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>)
        }
    } return (
        <Navigate to='/dashboard/home' />
    );
}