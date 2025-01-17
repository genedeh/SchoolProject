import { useClassrooms } from "../../../../../contexts/Classrooms.contexts";
import { useState } from "react";
import axios from "axios";
import { Modal, Button, Alert, Form } from 'react-bootstrap'
import { ClassRoomTeacherSelectPopUp } from "../SelectPopUps/ClassroomTeacherSelectPopupComponent";
import { ClassroomStudentsSelectPopUp } from "../SelectPopUps/ClassroomStudentsSelectPopupComponent";


export const CreateClassroomModal = ({ show, handleClose }) => {
    const { refetchNewData } = useClassrooms();
    const [name, setName] = useState('');
    const [listShow, setListShow] = useState(false);
    const [listShow2, setListShow2] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [created, setCreated] = useState(false);
    const [success, setSuccess] = useState(null);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const createClassroomCloseHandler = () => {
        setName('');
        setSelectedTeacher(null);
        setSelectedStudents([]);
        setLoading(false);
    };

    const handleSubmit = () => {
        const token = localStorage.getItem("token")
        // Check if the classroom name already exists
        setLoading(true);
        setCreated(false);

        if (!token) {
            throw new Error("Authentication token is missing!");
        }

        if (name.length < 8 && name.length !== 0) {
            axios.get(`api/classrooms/?name=${name}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
                .then(response => {
                    if (response.data.results.length > 0) {
                        setError('Classroom name already exists.');
                        setLoading(false);
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
                        axios.post('api/classrooms/', data, 
                            {
                                headers: { Authorization: `Bearer ${token}` },
                            }
                        )
                            .then(() => {
                                setSuccess('Subject created successfully.');
                                setCreated(true);
                                createClassroomCloseHandler();
                            })
                            .catch(error => {
                                setError("Failed to create classroom.");
                                setLoading(false);
                            });
                    }
                })
                .catch(error => {
                    setLoading(false);
                    if (!selectedTeacher) {
                        setError('Select a teacher to be assigned to the classroom.');
                    } else {
                        setError('Failed to create classroom.');
                    }
                });
        } else {
            setError("Class name is beyond max length");
            setLoading(false);
        }
    };

    return (
        <>
            <Modal show={show} fullscreen scrollable onHide={() => {
                if (!loading) {
                    createClassroomCloseHandler();
                    handleClose();
                    if (created) {
                        refetchNewData();
                    }
                }

            }
            }>
                <Modal.Header closeButton>
                    <Modal.Title>Create Classroom</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="subjectName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                placeholder="Enter classroom name"
                                required
                            />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="classroomTeacher">
                            <Form.Label>Assigned Teacher</Form.Label>
                            <br />
                            <Button
                                variant="outline-primary"
                                required
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
                                aria-required="true"
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
                    <br />
                    {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
                    {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}
                </Modal.Body>
                <Modal.Footer className="justify-content-bottom">
                    <Button variant="primary" onClick={() => {
                        setLoading(true);
                        setError(null);
                        setSuccess(null);
                        handleSubmit();
                    }} disabled={loading} type='submit'>
                        {loading ? 'Creating classroom...' : 'Create Classroom'}
                    </Button>
                </Modal.Footer>
            </Modal>
            <ClassRoomTeacherSelectPopUp show={listShow} handleClose={() => setListShow(false)} selectedTeacher={selectedTeacher} setSelectedTeacher={setSelectedTeacher} />
            <ClassroomStudentsSelectPopUp show={listShow2} handleClose={() => setListShow2(false)} selectedStudents={selectedStudents} setSelectedStudents={setSelectedStudents} />
        </>
    );
};