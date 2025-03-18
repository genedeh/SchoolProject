import  useSubjects  from "../../../../../contexts/Subjects.contexts";
import { useState } from "react";
import axios from "axios";
import { Modal, Button, Alert, Form } from 'react-bootstrap'
import { TeacherSelectPopUp } from "../SelectPopUps/SubjectTeacherSelectPopupComponent";
import { StudentsSelectPopUp } from "../SelectPopUps/SubjectStudentsSelectPopupComponent";

export const CreateSubjectModal = ({ show, handleClose }) => {
    const { refetchNewData } = useSubjects();
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

    const createSubjectCloseHandler = () => {
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
        // Check if the subject name already exists
        if (name.length < 1000 && name.length !== 0) {
            axios.get(`api/subjects/?name=${name}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
                .then(response => {
                    if (response.data.results.length > 0 && response.data.results[0].name === name) {
                        setError('Subject name already exists.');
                        setLoading(false);
                    } else {
                        // Proceed to create the subject
                        const data = {
                            name,
                            assigned_teacher:
                                selectedTeacher.id
                            ,
                            students_offering: selectedStudents.map(student => {
                                return (
                                    student.id
                                )
                            })
                        }
                        axios.post('api/subjects/', data,
                            {
                                headers: { Authorization: `Bearer ${token}` },
                            }
                        )
                            .then(() => {
                                setSuccess('Subject created successfully.');
                                setCreated(true);
                                createSubjectCloseHandler();
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
                        setError('Select a teacher to be assigned to the subject.');
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
                    createSubjectCloseHandler();
                    handleClose();
                    if (created) {
                        refetchNewData();
                    }
                }

            }
            }>
                <Modal.Header closeButton>
                    <Modal.Title>Create Subject</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="subjectName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                placeholder="Enter subject name"
                                required
                            />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="subjectTeacher">
                            <Form.Label>Assign Teacher</Form.Label>
                            <br />
                            <Button
                                variant="outline-primary"
                                onClick={() => {
                                    setListShow(true)
                                }}
                            >{selectedTeacher ? selectedTeacher.username.replace('_', ' ') : 'Select a teacher'}</Button>
                        </Form.Group>
                        <br />
                        <Form.Group controlId="subjectStudents">
                            <Form.Label>Students Offering</Form.Label>
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
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => {
                        setLoading(true);
                        setError(null);
                        setSuccess(null);
                        handleSubmit();
                    }} disabled={loading} type='submit'>
                        {loading ? 'Creating Subject...' : 'Create Subject'}
                    </Button>
                </Modal.Footer>
            </Modal>
            <TeacherSelectPopUp show={listShow} handleClose={() => setListShow(false)} selectedTeacher={selectedTeacher} setSelectedTeacher={setSelectedTeacher} />
            <StudentsSelectPopUp show={listShow2} handleClose={() => setListShow2(false)} selectedStudents={selectedStudents} setSelectedStudents={setSelectedStudents} />
        </>
    );
};