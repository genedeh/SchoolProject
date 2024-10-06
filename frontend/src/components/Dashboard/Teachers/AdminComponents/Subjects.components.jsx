import { useContext, useState } from "react";
import { UserContext } from "../../../../contexts/User.contexts";
import { SubjectsContext } from "../../../../contexts/Subjects.contexts";
import { Navigate } from "react-router-dom";
import { Accordion, Card, Button, ListGroup, Spinner, Image } from 'react-bootstrap';
import { Trash, Pencil, PlusCircleFill, GenderFemale, GenderMale } from 'react-bootstrap-icons';
import { DeleteSubjectModal } from "./SubjectTools/DeleteSubject.components";
import { CreateSubjectModal } from "./SubjectTools/CreateSubject.components";
import { UpdateSubjectModal } from "./SubjectTools/UpdateSubject.components";

export const Subjects = () => {
    const { currentUser } = useContext(UserContext);
    const { subjects, goToPrevPage, goToNextPage, currentPage, nextPage, totalSubjects, prevPage } = useContext(SubjectsContext);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
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
                    newStudents.push(stundent.id)
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
                                                <ListGroup.Item key={id}>
                                                    {profile_picture ? (<Image
                                                        src={profile_picture.includes('http://') ? (profile_picture) : (`http://127.0.0.1:8000/media/${profile_picture}`)}
                                                        roundedCircle
                                                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                        className="me-3" />)
                                                        : (<Image
                                                            src="http://127.0.0.1:8000/media/default_profile_images/default_image.jpeg"
                                                            roundedCircle
                                                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                            className="me-3" />)
                                                    }
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
            return (<Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>)
        }
    } return (
        <Navigate to='/dashboard/home' />
    );
}