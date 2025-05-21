import {  useState } from "react";
import { useUser } from "../../../../contexts/User.contexts";
import useSubjects from "../../../../contexts/Subjects.contexts";
import { Navigate } from "react-router-dom";
import { Accordion, Card, Button, ListGroup, Form, InputGroup } from 'react-bootstrap';
import { Trash, Pencil, PlusCircleFill, GenderFemale, GenderMale } from 'react-bootstrap-icons';
import { Search } from "react-bootstrap-icons";
import { DeleteSubjectModal } from "./SubjectTools/DeleteSubject.components";
import { CreateSubjectModal } from "./SubjectTools/CreateSubject.components";
import { UpdateSubjectModal } from "./SubjectTools/UpdateSubject.components";
import { ErrorAlert } from "../../../Alerts/ErrorAlert.components";
import { ErrorMessageHandling } from "../../../../utils/ErrorHandler.utils";
import CenteredSpinner from "../../../Loading/CenteredSpinner.components";

export const Subjects = () => {
    const { currentUser } = useUser();
    const {
        subjects,
        currentPage,
        nextPage,
        prevPage,
        loading,
        error,
        isError,
        goToNextPage,
        goToPrevPage,
        setTerm,
        totalSubjects,
        handleSearch,
    } = useSubjects();
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

    if (!currentUser.is_student_or_teacher && currentUser && currentUser.is_superuser) {
        return (
            <>
                <br />
                <InputGroup>
                    <Form.Control className="me-auto " placeholder='Search...' value={searchTerm} onChange={(e) => {
                        setSearchTerm(e.target.value)
                    }} />
                    <Button variant='outline-primary' className="custom-btn" onClick={() => {
                        setTerm(searchTerm);
                        handleSearch();
                    }}>
                        <Search className='me-2' />
                    </Button>
                </InputGroup>
                <div className="d-grid gap-2 m-2">
                    <Button variant="outline-primary" className="custom-btn2" size="lg" onClick={() => setShowCreateModal(true)} >
                        New subject <PlusCircleFill />
                    </Button>
                </div>
                <Accordion flush={true} className="m-3">
                    {loading && <CenteredSpinner caption="Fetching Subjects..." />}
                    {isError && <ErrorAlert heading="Error while fetching subjects" message={ErrorMessageHandling(isError, error)} removable={true} />}
                    {!loading && !isError && subjects.length === 0 && (
                        <p>No subjects found!</p>
                    )}
                    {!loading && !isError && subjects.length > 0 && (
                        subjects?.map(({ assigned_teacher, id, name, students_offering }) => (
                            <Card key={id} className="mb-2">
                                <Accordion.Item eventKey={id}>
                                    <Accordion.Header eventKey={id} className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5>{name.replace('_', ' ')}</h5>
                                            <small className="text-muted">Teacher: {assigned_teacher ? (assigned_teacher.username.replace('_', ' ')) : ("NO ASSIGNED TEACHER")}</small>
                                        </div>

                                    </Accordion.Header>
                                    <Button style={{ marginLeft: '20px', marginBottom: '10px' }} variant="outline-danger" className="custom-btn5 mt-2" onClick={() => handleDeleteClick(id)} ><Trash /></Button>
                                    <Button style={{ marginLeft: '20px', marginBottom: '10px' }} variant="outline-info" className="custom-btn2 mt-2" onClick={() => handleUpdateClick(id)} ><Pencil /></Button>
                                    <Accordion.Body>
                                        <hr /><h5>Students</h5><hr />
                                        <ListGroup>
                                            {students_offering.length !== 0 ? (students_offering.map(({ id, username, gender, profile_picture_url }) => (
                                                <ListGroup.Item key={id} className="d-flex justify-content-between align-items-center mt-2 shadow-sm border-2">
                                                    <div className="d-flex align-items-center">
                                                        <div className="me-3">
                                                            <img
                                                                src={profile_picture_url == null ? ("https://via.placeholder.com/40") : (profile_picture_url)}
                                                                alt={username}
                                                                className="rounded-circle"
                                                                style={{ objectFit: 'cover', width: '40px', height: '40px' }}
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
                        ))
                    )}
                </Accordion>
                <div className="d-flex justify-content-between align-items-center my-4">
                    <Button onClick={goToPrevPage} disabled={!prevPage || loading} className="custom-btn">
                        Previous
                    </Button>
                    <strong>Page {currentPage}</strong>
                    <Button onClick={goToNextPage} disabled={!nextPage || loading} className="custom-btn">
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
        )
    } return (
        <Navigate to='/dashboard/home' />
    );
}