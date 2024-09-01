import { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { UsersListContext } from "../../../../../contexts/UsersList.contexts";
import { SubjectsContext } from "../../../../../contexts/Subjects.contexts";
import axios from 'axios';

export const UpdateSubjectModal = ({ show, handleClose, subject }) => {
    const { usersList } = useContext(UsersListContext);
    const { setSubjects } = useContext(SubjectsContext);
    const [name, setName] = useState('');
    const [assignedTeacher, setAssignedTeacher] = useState('');
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (subject) {
            setName(subject.name);
            setAssignedTeacher(subject.assigned_teacher.id || {});
            setStudents(subject.students_offering);
        }
        const newSetOfTeachers =
            usersList.filter((user) => {
                if (!user.is_student_or_teacher) {
                    return user
                }
            });
        const newSetOfStudents =
            usersList.filter((user) => {
                if (user.is_student_or_teacher) {
                    return user
                }
            });
        setTeachers(newSetOfTeachers);
        setAllStudents(newSetOfStudents);
    }, [show]);

    const isStudentSelected = (studentId) => Array.isArray(students) && students.includes(studentId);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const data = {
                name,
                assigned_teacher: assignedTeacher,
                students_offering: students.map((student) => {
                    return student
                }),
            }
            await axios.put(`http://127.0.0.1:8000/api/subjects/${subject.id}/`, data)
                .then((response) => {
                    setSubjects((prevSubjects) =>
                        prevSubjects.map((subject) =>
                            subject.id === response.data['id'] ? response.data : subject
                        )
                    );
                });
            setSuccess('Subject updated successfully.');
            handleClose();
            setSuccess(null)
            setError(null)
        } catch (error) {
            console.log(error)
            setError('Failed to update subject.');
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Update Subject</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form onSubmit={handleUpdate}>
                    <Form.Group controlId="formName">
                        <Form.Label>Subject Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter subject name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formAssignedTeacher">
                        <Form.Label>Assigned Teacher</Form.Label>
                        <Form.Control
                            as="select"
                            value={assignedTeacher}
                            onChange={(e) => setAssignedTeacher(e.target.value)}
                        >
                            <option value="">{assignedTeacher.username}</option>
                            {teachers.map((teacher) => (
                                <option key={teacher.id} value={teacher.id}>
                                    {teacher.username}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formStudents">
                        <Form.Label>Students Offering</Form.Label>
                        <Form.Control
                            as="select"
                            multiple
                            value={students}
                            onChange={(e) => setStudents(Array.from(e.target.selectedOptions, (option) => option.value))}
                        >
                            {/* First render selected students in gray */}
                            {allStudents
                                .filter((student) => isStudentSelected(student.id))
                                .map((student) => (
                                    <option
                                        key={student.id}
                                        value={student.id}
                                        style={{ color: 'gray' }} // Styling the selected students as gray
                                    >
                                        {student.username} (selected)
                                    </option>
                                ))}
                            {/* Render unselected students normally */}
                            {allStudents
                                .filter((student) => !isStudentSelected(student.id))
                                .map((student) => (
                                    <option key={student.id} value={student.id}>
                                        {student.username}
                                    </option>
                                ))}
                        </Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Update Subject
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};
