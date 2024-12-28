import { ClassroomsContext } from "../../../../../contexts/Classrooms.contexts";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Alert, Form } from 'react-bootstrap'
import { ClassRoomTeacherSelectPopUp } from "../SelectPopUps/ClassroomTeacherSelectPopupComponent";
import { ClassroomStudentsSelectPopUp } from "../SelectPopUps/ClassroomStudentsSelectPopupComponent";
import { LoadingOverlay } from "../../../../Loading/LoadingOverlay.components";
import { ErrorAlert } from "../../../../Alerts/ErrorAlert.components";


export const CreateClassroomModal = ({ show, handleClose }) => {
    const { fetchClassrooms } = useContext(ClassroomsContext);
    const [name, setName] = useState('');
    const [listShow, setListShow] = useState(false);
    const [listShow2, setListShow2] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);


    useEffect(() => { 
        if (error) {
            setLoading(false);
            setTimeout(() => { 
                setError(null);
            }, 2000);
        }
    }, [error]);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const createClassroomCloseHandler = () => {
        setSuccess('Subject created successfully.');
        setName('');
        setSelectedTeacher(null);
        setSelectedStudents([]);
        setError(null);
        setSuccess(null);
        setLoading(false);
        handleClose();
    };

    const handleSubmit = () => {
        // Check if the classroom name already exists
        setLoading(true);
        if (name.length < 8 && name.length !== 0) {
            axios.get(`api/classrooms/?name=${name}`)
                .then(response => {
                    console.log(response);
                    if (response.data.results.length > 0) {
                        setError('Classroom name already exists.');
                    } else {
                        // Proceed to create the classroom
                        const data = {
                            name,
                            assigned_teacher:
                                selectedTeacher.id
                            ,
                            students: selectedStudents.map(student => {
                                return (
                                    student.id
                                )
                            })
                        }
                        axios.post('api/classrooms/', data)
                            .then(() => {
                                fetchClassrooms(1);
                                createClassroomCloseHandler();
                            })
                            .catch(error => {
                                setError("Failed to create classroom.");
                            });
                    }
                })
                .catch(error => {
                    if (!selectedTeacher) {
                        setError('Select a teacher to be assigned to the classroom.');
                    } else {
                        setError('Failed to create classroom.');
                    }
                });
        } else {
            setError("Class name is beyond max length");
        }
    };

    return (
        <>
            <LoadingOverlay loading={loading} message="Creating Your Classroom..." />
            <Modal show={show} fullscreen scrollable onHide={createClassroomCloseHandler}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Classroom</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <ErrorAlert heading={'Classroom creation error.'}  message={error} />}
                    {success && <Alert variant="success">{success}</Alert>}
                    <Form>
                        <Form.Group controlId="subjectName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                placeholder="Enter classroom name"
                            />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="classroomTeacher">
                            <Form.Label>Assigned Teacher</Form.Label>
                            <br />
                            <Button
                                variant="outline-primary"
                                onClick={() => {
                                    setListShow(true)
                                }}>{selectedTeacher ? selectedTeacher.username.replace('_', ' ') : 'Select a teacher'}</Button>
                        </Form.Group>
                        <br />
                        <Form.Group controlId="classroomStudents">
                            <Form.Label>Students</Form.Label>
                            <br />
                            <Button
                                variant="outline-primary"
                                className="mb-1"
                                onClick={() => {
                                    setListShow2(true)
                                }}
                            >Select Students</Button>
                            <div>
                                {selectedStudents.map(student => (
                                    <span key={student.id} className="m-2">
                                        {student.username.replace('_', ' ')}
                                        <Button size="sm" className="m-1" variant="outline-danger"
                                            onClick={() => {
                                                setSelectedStudents(selectedStudents.filter(s => {
                                                    if (s !== student) {
                                                        return student;
                                                    }
                                                }));
                                            }}>&times;</Button><br />
                                    </span>
                                ))}
                            </div>
                        </Form.Group>
                        <br />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => {
                        setLoading(true)
                        handleSubmit()
                    }}>
                        Add Classroom
                    </Button>
                </Modal.Footer>
            </Modal>
            <ClassRoomTeacherSelectPopUp show={listShow} handleClose={() => setListShow(false)} selectedTeacher={selectedTeacher} setSelectedTeacher={setSelectedTeacher} />
            <ClassroomStudentsSelectPopUp show={listShow2} handleClose={() => setListShow2(false)} selectedStudents={selectedStudents} setSelectedStudents={setSelectedStudents} />
        </>
    );
};