import { SubjectsContext } from "../../../../../contexts/Subjects.contexts";
import { useState, useContext} from "react";
import axios from "axios";
import { Modal, Button, Alert, Form } from 'react-bootstrap'
import { TeacherSelectPopUp } from "../SelectPopUps/SubjectTeacherSelectPopupComponent";
import { StudentsSelectPopUp } from "../SelectPopUps/SubjectStudentsSelectPopupComponent";

export const CreateSubjectModal = ({ show, handleClose }) => {
    const { setSubjects, subjects } = useContext(SubjectsContext);
    const [name, setName] = useState('');
    const [listShow, setListShow] = useState(false);
    const [listShow2, setListShow2] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);


    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const createSubjectCloseHandler = () => {
        setSuccess('Subject created successfully.');
        setName('');
        setSelectedTeacher(null);
        setSelectedStudents([]);
        setError(null);
        setSuccess(null);
        handleClose();
    };

    const handleSubmit = () => {
        // Check if the subject name already exists
        if (name.length < 100 && name.length !== 0) {
            axios.get(`api/subjects/?name=${name}`)
                .then(response => {
                    if (response.data.length > 0) {
                        setError('Subject name already exists.');
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
                        const data_refined = {
                            id: null,
                            name,
                            assigned_teacher: {
                                "id": selectedTeacher.id,
                                "username": selectedTeacher.username,
                                "gender": selectedTeacher.gender
                            }
                            ,
                            students_offering: selectedStudents.map(student => {
                                return (
                                    {
                                        "id": student.id,
                                        "username": student.username,
                                        "gender": student.gender
                                    }
                                )
                            })
                        }
                        axios.post('api/subjects/', data)
                            .then((response) => {
                                data_refined["id"] = response.data.id
                                setSubjects([...subjects, data_refined]);
                                createSubjectCloseHandler();
                            })
                            .catch(error => {
                                setError("Failed to create subject.");
                            });
                    }
                })
                .catch(error => {
                    setError(`Select a teacher to be assigned to ${name}.`);
                });
        } else {
            setError("Subject Name Exceded Max Length")
        }
    };

    return (
        <>
            <Modal show={show} onHide={createSubjectCloseHandler}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Subject</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <Form>
                        <Form.Group controlId="subjectName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                placeholder="Enter subject name"
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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSubmit}>
                        Add Subject
                    </Button>
                </Modal.Footer>
            </Modal>
            <TeacherSelectPopUp show={listShow} handleClose={() => setListShow(false)} selectedTeacher={selectedTeacher} setSelectedTeacher={setSelectedTeacher} />
            <StudentsSelectPopUp show={listShow2} handleClose={() => setListShow2(false)} selectedStudents={selectedStudents} setSelectedStudents={setSelectedStudents} />
        </>
    );
};