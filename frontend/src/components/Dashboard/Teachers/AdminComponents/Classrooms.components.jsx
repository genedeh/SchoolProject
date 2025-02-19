import { useUser } from "../../../../contexts/User.contexts";
import useClassrooms from "../../../../contexts/Classrooms.contexts";
import {  useState } from "react";
import { Navigate } from "react-router-dom";
import { Button, Accordion, Card, ListGroup, InputGroup, Form } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { GenderFemale, GenderMale, Trash, Pencil, PlusCircleFill } from "react-bootstrap-icons";
import { DeleteClassroomModal } from "./ClassroomTools/DeleteClassroom.components";
import { CreateClassroomModal } from "./ClassroomTools/CreateClassroom.components";
import { UpdateClassroomModal } from "./ClassroomTools/UpdateClassroom.components";
import { ErrorAlert } from "../../../Alerts/ErrorAlert.components";
import { ErrorMessageHandling } from "../../../../utils/ErrorHandler.utils";
import { CenteredSpinner } from "../../../Loading/CenteredSpinner.components";

export const Classrooms = () => {
    const { currentUser } = useUser();
    const {
        classrooms,
        currentPage,
        nextPage,
        prevPage,
        loading,
        error,
        isError,
        goToNextPage,
        goToPrevPage,
        setTerm,
        totalClassrooms,
        handleSearch,
    } = useClassrooms();
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

    if (!currentUser.is_student_or_teacher && currentUser && currentUser.is_admin) {
        return (
            <>
                <br />
                <InputGroup>
                    <Form.Control className="me-auto " placeholder='Search...' value={searchTerm} onChange={(e) => {
                        setSearchTerm(e.target.value)
                    }} />
                    <Button variant='outline-primary' onClick={() => {
                        setTerm(searchTerm);
                        handleSearch();
                    }}>
                        <Search className='me-2' />
                    </Button>
                </InputGroup>
                <div className="d-grid gap-2 m-2">
                    <Button variant="outline-primary" size="lg" onClick={() => setShowCreateModal(true)} >
                        New classroom <PlusCircleFill />
                    </Button>
                </div>
                <Accordion flush={true} className="m-3">
                    {loading && <CenteredSpinner caption="Fetching Classrooms..." />}
                    {isError && <ErrorAlert heading="Error while fetching classrooms" message={ErrorMessageHandling(isError, error)} removable={true} />}
                    {!loading && !isError && classrooms.length === 0 && (
                        <p>No classrooms found!</p>
                    )}
                    {!loading && !isError && classrooms.length > 0 && (
                        classrooms?.map(({ assigned_teacher, id, name, students }) => (
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
                                            {students.length !== 0 ? (students.map(({ id, username, gender, profile_picture_url }) => (
                                                <ListGroup.Item key={id} className="container">
                                                    <div className="d-flex align-items-center">
                                                        <div className="me-3">
                                                            <img
                                                                src={profile_picture_url == null ? ("https://via.placeholder.com/40") : (profile_picture_url)}
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
                        ))
                    )}

                </Accordion>
                <div className="d-flex justify-content-between align-items-center my-4">
                    <Button onClick={goToPrevPage} disabled={!prevPage || loading}>
                        Previous
                    </Button>
                    <span>Page {currentPage}</span>
                    <Button onClick={goToNextPage} disabled={!nextPage || loading}>
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
    } return (
        <Navigate to='/dashboard/home' />
    );
}