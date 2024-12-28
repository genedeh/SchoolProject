import { UserContext } from "../../../../contexts/User.contexts";
import { ClassroomsContext } from "../../../../contexts/Classrooms.contexts";
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { Button, Accordion, Card, ListGroup, Spinner, Image, InputGroup, Form } from "react-bootstrap";
import { GenderFemale, GenderMale, Trash, Pencil, PlusCircleFill } from "react-bootstrap-icons";
import { DeleteClassroomModal } from "./ClassroomTools/DeleteClassroom.components";
import { CreateClassroomModal } from "./ClassroomTools/CreateClassroom.components";
import { UpdateClassroomModal } from "./ClassroomTools/UpdateClassroom.components";
import { LoadingOverlay } from "../../../Loading/LoadingOverlay.components";

export const Classrooms = () => {
    const { currentUser } = useContext(UserContext);
    const { classrooms, goToPrevPage, goToNextPage, currentPage, nextPage, totalClassrooms, prevPage, setTerm, loading } = useContext(ClassroomsContext);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedClassroomId, setSelectedClassroomId] = useState(null);
    const [selectedClassroomForUpdate, setSelectedClassroomForUpdate] = useState(null);


    const handleDeleteClick = (classId) => {
        setSelectedClassroomId(classId);
        setShowDeleteModal(true);
    };
    const handleUpdateClick = (classId) => {
        classrooms.map((classroom) => {
            if (classroom.id === classId) {
                const classroomClone = { ...classroom }
                const newStudents = []
                classroomClone.students.map((student) => {
                    newStudents.push(student)
                })
                classroomClone['students'] = newStudents
                setSelectedClassroomForUpdate(classroomClone)
                return classroomClone;
            }
        })
        setShowUpdateModal(true)
    }

    if (loading) {
        return (
            <LoadingOverlay loading={loading} message="Fetching Classrooms..." />
        );
    }

    if (!currentUser.is_student_or_teacher && currentUser && currentUser.is_admin) {
        if (classrooms.length !== 0) {
            return (
                <>
                    <InputGroup>
                        <Form.Control className="m-4" size="sm" placeholder='Enter Classroom Name...' value={searchTerm} onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setTerm(e.target.value)
                        }} />
                    </InputGroup>
                    <div className="d-grid gap-2 m-2">
                        <Button variant="outline-primary" size="lg" onClick={() => setShowCreateModal(true)} >
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
                                            {students.length !== 0 ? (students.map(({ id, username, gender, profile_picture }) => (
                                                <ListGroup.Item key={id} className="container">
                                                    <div className="d-flex align-items-center">
                                                        <div className="me-3">
                                                            <img
                                                                src={profile_picture == null ? ("https://via.placeholder.com/40") : (profile_picture)}
                                                                className="rounded-circle"
                                                                style={{ width: '40px', height: '40px' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <div>{username}</div>
                                                        </div>
                                                        {gender === 'male' ?
                                                            (<Button className="m-2" size="sm" variant='primary' style={{ 'borderColor': 'white' }}>
                                                                <GenderMale />
                                                            </Button>) :
                                                            (<Button className="m-2" size="sm" style={{ 'backgroundColor': 'pink', 'borderColor': 'white' }}>
                                                                <GenderFemale />
                                                            </Button>)}
                                                    </div>
                                                </ListGroup.Item>
                                            ))) : ('NO Student Available')}
                                        </ListGroup>
                                    </Accordion.Body>
                                </Accordion.Item>

                            </Card>
                        ))}
                    </Accordion>
                    <div className="d-flex justify-content-between align-items-center my-4">
                        <Button onClick={goToPrevPage} disabled={!prevPage}>
                            Previous
                        </Button>
                        <span>Page {currentPage}</span>
                        <Button onClick={goToNextPage} disabled={!nextPage}>
                            Next
                        </Button>
                    </div>

                    <p>Total Classrooms: {totalClassrooms}</p>
                    <DeleteClassroomModal
                        show={showDeleteModal}
                        handleClose={() => setShowDeleteModal(false)}
                        classroomId={selectedClassroomId}
                    />
                    <CreateClassroomModal show={showCreateModal} handleClose={() => setShowCreateModal(false)} />
                    <UpdateClassroomModal show={showUpdateModal} handleClose={() => setShowUpdateModal(false)} classroom={selectedClassroomForUpdate} />
                </>
            );
        } else {
            return (
                <>
                    <div className="d-grid gap-2 m-2">
                        <Button variant="outline-primary" size="lg" onClick={() => setShowCreateModal(true)} >
                            New classroom <PlusCircleFill />
                        </Button>
                    </div>
                    <InputGroup>
                        <Form.Control className="m-4" size="sm" placeholder='Enter Classroom Name...' value={searchTerm} onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setTerm(e.target.value)
                        }} />
                    </InputGroup>
                    <h1>NO CLASSROOMS WHERE FOUND</h1>
                    <DeleteClassroomModal
                        show={showDeleteModal}
                        handleClose={() => setShowDeleteModal(false)}
                        classroomId={selectedClassroomId}
                    />
                    <CreateClassroomModal show={showCreateModal} handleClose={() => setShowCreateModal(false)} />
                    <UpdateClassroomModal show={showUpdateModal} handleClose={() => setShowUpdateModal(false)} classroom={selectedClassroomForUpdate} />
                </>
            )
        }
    } return (
        <Navigate to='/dashboard/home' />
    );
}