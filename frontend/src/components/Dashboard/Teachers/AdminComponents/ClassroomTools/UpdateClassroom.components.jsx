import { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { UsersListContext } from "../../../../../contexts/UsersList.contexts";
import { ClassroomsContext } from "../../../../../contexts/Classrooms.contexts";
import axios from 'axios';

export const UpdateClassroomModal = ({ show, handleClose, classroom }) => {
    const { usersList, refresh, setRefresh } = useContext(UsersListContext);
    const { setClassrooms } = useContext(ClassroomsContext);
    const [name, setName] = useState('');
    const [assignedTeacher, setAssignedTeacher] = useState(null);
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (classroom) {
            setName(classroom.name);
            try {
                setAssignedTeacher(classroom.assigned_teacher || '');
            } catch (error) {
                setAssignedTeacher(null)
            }

            setStudents(classroom.students);
        }
        const newSetOfTeachers =
            usersList.filter((user) => {
                if (!user.is_student_or_teacher && user.user_class === "None") {
                    if (assignedTeacher && user.id === assignedTeacher.id) {
                        return user
                    } else {
                        return user
                    }
                }
            });
        const newSetOfStudents =
            usersList.filter((user) => {
                if (user.is_student_or_teacher && user.user_class === "None") {
                    return user
                }
            });
        setTeachers(newSetOfTeachers);
        setAllStudents(newSetOfStudents);
    }, [show]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            students.map((student) => {
                classroom.students.push(Number(student))
            })
            const data = {
                name,
                assigned_teacher: assignedTeacher.id,
                students: classroom.students.includes(NaN) ? [] : classroom.students,
            }
            console.log(data)
            await axios.put(`api/classrooms/${classroom.id}/`, data)
                .then((response) => {
                    setClassrooms((prevClassrooms) =>
                        prevClassrooms.map((classroom) =>
                            classroom.id === response.data['id'] ? response.data : classroom
                        )
                    );
                });
            setSuccess('Classroom updated successfully.');
            handleClose();
            setSuccess(null)
            setError(null)
            setRefresh(!refresh)
        } catch (error) {
            setError('Failed to update classroom.');
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Update Classroom</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form onSubmit={handleUpdate}>
                    <Form.Group controlId="formName">
                        <Form.Label>Classroom Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter classroom name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <br />
                    <Form.Group controlId="formAssignedTeacher">
                        <Form.Label>Assigned Teacher</Form.Label>
                        <Form.Control
                            as="select"
                            value={assignedTeacher}
                            onChange={(e) => setAssignedTeacher(e.target.value)}
                        >
                            <option value="">{assignedTeacher ? (assignedTeacher.username) : ('None')}</option>

                            {teachers.map((teacher) => (
                                <option key={teacher.id} value={teacher.id}>
                                    {teacher.username.replace('_', ' ')}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <br />
                    <Form.Group controlId="formStudents">
                        <Form.Label>Students </Form.Label>
                        <Form.Control
                            as="select"
                            multiple
                            value={students}
                            onChange={(e) => setStudents(Array.from(e.target.selectedOptions, (option) => option.value))}
                        >
                            {/* First render selected classroom in gray */}
                            <option key="d" onClick={() => classroom.students = []}>
                                None
                            </option>
                            {allStudents
                                .map((student) => (
                                    <option key={student.id} value={student.id}>
                                        {student.username.replace('_', ' ')}
                                    </option>
                                ))}

                        </Form.Control>
                    </Form.Group>
                    <br />
                    <Button variant="primary" type="submit">
                        Update Classroom
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};
