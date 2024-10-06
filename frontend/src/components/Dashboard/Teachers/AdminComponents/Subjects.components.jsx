import { useContext, useState } from "react";
import { UserContext } from "../../../../contexts/User.contexts";
import { SubjectsContext } from "../../../../contexts/Subjects.contexts";
import { Navigate } from "react-router-dom";
import { Accordion, Card, Button, ListGroup, Spinner, Form, InputGroup } from 'react-bootstrap';
import { Trash, Pencil, PlusCircleFill, GenderFemale, GenderMale } from 'react-bootstrap-icons';
import { DeleteSubjectModal } from "./SubjectTools/DeleteSubject.components";
import { CreateSubjectModal } from "./SubjectTools/CreateSubject.components";
import { UpdateSubjectModal } from "./SubjectTools/UpdateSubject.components";

export const Subjects = () => {
    const { currentUser } = useContext(UserContext);
    const { subjects, goToPrevPage, goToNextPage, currentPage, nextPage, totalSubjects, prevPage, setTerm } = useContext(SubjectsContext);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [selectedSubjectForUpdate, setSelectedSubjectForUpdate] = useState(null);



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
                    newStudents.push(stundent)
                })
                subjectClone['students_offering'] = newStudents
                setSelectedSubjectForUpdate(subjectClone)
                return subjectClone;
            }
        })
        setShowUpdateModal(true)
    }

    if (!currentUser.is_student_or_teacher && currentUser && currentUser.is_admin) {
        if (subjects.length !== 0) {
            return (
                <>
                    <div className="d-grid gap-2 m-2">
                        <Button variant="outline-primary" size="lg" onClick={() => setShowCreateModal(true)} >
                            New subject <PlusCircleFill />
                        </Button>
                    </div>
                    <InputGroup>
                        <Form.Control className="m-4" size="sm" placeholder='Enter Subject Name...' value={searchTerm} onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setTerm(e.target.value)
                        }} />
                    </InputGroup>
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
                                    <Button style={{ marginLeft: '20px', marginBottom: '10px' }} variant="outline-danger" onClick={() => handleDeleteClick(id)} ><Trash /></Button>
                                    <Button style={{ marginLeft: '20px', marginBottom: '10px' }} variant="outline-info" onClick={() => handleUpdateClick(id)} ><Pencil /></Button>
                                    <Accordion.Body>
                                        <hr /><h5>Students</h5><hr />
                                        <ListGroup>
                                            {students_offering.length !== 0 ? (students_offering.map(({ id, username, gender, profile_picture }) => (
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

                    <p>Total Subjects: {totalSubjects}</p>
                    <DeleteSubjectModal
                        show={showDeleteModal}
                        handleClose={() => setShowDeleteModal(false)}
                        subjectId={selectedSubjectId}
                    />
                    <CreateSubjectModal show={showCreateModal} handleClose={() => setShowCreateModal(false)} />
                    <UpdateSubjectModal show={showUpdateModal} handleClose={() => setShowUpdateModal(false)} subject={selectedSubjectForUpdate} />
                </>
            );
        } else {
            return (
                <>
                    <InputGroup>
                        <Form.Control className="m-4" size="sm" placeholder='Enter Subject Name...' value={searchTerm} onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setTerm(e.target.value)
                        }} />
                    </InputGroup>
                    <h1>NO SUBJECTS WHERE FOUND</h1>
                </>
            )
        }
    } return (
        <Navigate to='/dashboard/home' />
    );
}