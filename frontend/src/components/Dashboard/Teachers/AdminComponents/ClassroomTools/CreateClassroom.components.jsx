import { UsersListContext } from "../../../../../contexts/UsersList.contexts";
import { ClassroomsContext } from "../../../../../contexts/Classrooms.contexts";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Alert, Form, DropdownButton, Dropdown } from 'react-bootstrap'

export const CreateClassroomModal = ({ show, handleClose }) => {
    const { usersList, refresh, setRefresh } = useContext(UsersListContext);
    const { setClassrooms, classrooms } = useContext(ClassroomsContext);
    const [name, setName] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const newSetOfTeachers =
            usersList.filter((user) => {
                if (!user.is_student_or_teacher && user.user_class === "None" && !user.is_superuser) {
                    return user
                }
            });
        const newSetOfStudents =
            usersList.filter((user) => {
                if (user.is_student_or_teacher && user.user_class === "None") {
                    return user
                }
            });

        if (show) {
            setTeachers(newSetOfTeachers);
            setStudents(newSetOfStudents);
        }
    }, [show]);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const createClassroomCloseHandler = () => {
        setRefresh(!refresh)
        setSuccess('Subject created successfully.');
        setName('');
        setSelectedTeacher(null);
        setSelectedStudents([]);
        setError(null);
        setSuccess(null);
        handleClose();
    };

    const handleSubmit = () => {
        // Check if the classroom name already exists
        axios.get(`api/classrooms/?name=${name}`)
            .then(response => {
                if (response.data.length > 0) {
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
                    const data_refined = {
                        id: null,
                        name,
                        assigned_teacher: {
                            "id": selectedTeacher.id,
                            "username": selectedTeacher.username,
                            "gender": selectedTeacher.gender
                        }
                        ,
                        students: selectedStudents.map(student => {
                            return (
                                {
                                    "id": student.id,
                                    "username": student.username,
                                    "gender": student.gender
                                }
                            )
                        })
                    }
                    axios.post('api/classrooms/', data)
                        .then((response) => {
                            data_refined["id"] = response.data.id
                            setClassrooms([...classrooms, data_refined]);
                            createClassroomCloseHandler();
                        })
                        .catch(error => {
                            setError("Failed to create classroom.");
                        });
                }
            })
            .catch(error => {
                setError(`Select a teacher to be assigned to ${name}.`);
            });
    };

    return (
        <Modal show={show} onHide={createClassroomCloseHandler}>
            <Modal.Header closeButton>
                <Modal.Title>Create Classroom</Modal.Title>
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
                            placeholder="Enter classroom name"
                        />
                    </Form.Group>
                    <br />
                    <Form.Group controlId="classroomTeacher">
                        <Form.Label>Assign Teacher</Form.Label>
                        <DropdownButton
                            title={selectedTeacher ? selectedTeacher.username.replace('_', ' ') : 'Select a teacher'}
                        >
                            {teachers.map(teacher => (
                                <Dropdown.Item
                                    key={teacher.id}
                                    eventKey={teacher}
                                    onClick={() => {
                                        setSelectedTeacher(teacher);
                                    }}
                                >
                                    {teacher.username.replace('_', ' ')}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </Form.Group>
                    <br />
                    <Form.Group controlId="classroomStudents">
                        <Form.Label>Students</Form.Label>
                        <DropdownButton
                            title="Select students"
                            className="mb-1"
                        >
                            {students.map(student => (
                                <Dropdown.Item
                                    key={student.id}
                                    eventKey={student}
                                    onClick={() => {
                                        if (!selectedStudents.includes(student)) {
                                            setSelectedStudents(selectedStudents => [...selectedStudents, student]);
                                        }
                                    }}
                                >
                                    {student.username.replace('_', ' ')}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
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
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Add Classroom
                </Button>
            </Modal.Footer>
        </Modal>
    );
};