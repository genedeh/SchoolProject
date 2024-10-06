import { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { SubjectsContext } from "../../../../../contexts/Subjects.contexts";
import { TeacherSelectPopUp } from "../SelectPopUps/SubjectTeacherSelectPopupComponent";
import { StudentsSelectPopUp } from "../SelectPopUps/SubjectStudentsSelectPopupComponent";
import axios from 'axios';

export const UpdateSubjectModal = ({ show, handleClose, subject }) => {
    const { setSubjects } = useContext(SubjectsContext);
    const [name, setName] = useState('');
    const [assignedTeacher, setAssignedTeacher] = useState(null);
    const [students, setStudents] = useState([]);
    const [listShow, setListShow] = useState(false);
    const [listShow2, setListShow2] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (show) {
            if (subject) {
                setName(subject.name)
                try {
                    setAssignedTeacher(subject.assigned_teacher || '');
                } catch (error) {
                    setAssignedTeacher(null)
                }
                setStudents(subject.students_offering);
            }
        }
    }, [show]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const data = {
                name,
                assigned_teacher: assignedTeacher.id,
                students_offering: students.map((student) => {
                    return student.id
                }),
            }
            await axios.put(`api/subjects/${subject.id}/`, data)
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
            setError('Failed to update subject.');
        }
    };

    return (
        <>
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
                        <br />
                        <Form.Group controlId="formAssignedTeacher">
                            <Form.Label>Assigned Teacher</Form.Label>
                            <br />
                            <Button onClick={() => {
                                setListShow(true)
                            }} variant="outline-primary">{assignedTeacher ? (assignedTeacher.username) : ('None')}</Button>
                        </Form.Group>
                        <br />
                        <Form.Group controlId="formStudents">
                            <Form.Label>Students Offering</Form.Label>
                            <br />
                            <Button
                                variant="outline-primary"
                                onClick={() => {
                                    setListShow2(true)
                                }}
                            >
                                Select Students
                            </Button>
                            <div>
                                {students.map(student => (
                                    <span key={student.id} className="m-2">
                                        {student.username.replace('_', ' ')}
                                        <Button size="sm" className="m-1" variant="outline-danger"
                                            onClick={() => {
                                                setStudents(students.filter(s => {
                                                    if (s !== student) {
                                                        return student;
                                                    }
                                                }));
                                            }}>&times;</Button><br />
                                    </span>
                                ))}
                            </div>
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="submit">
                        Update Subject
                    </Button>
                </Modal.Footer>
            </Modal>
            <TeacherSelectPopUp show={listShow} handleClose={() => setListShow(false)} selectedTeacher={assignedTeacher} setSelectedTeacher={setAssignedTeacher} />
            <StudentsSelectPopUp show={listShow2} handleClose={() => setListShow2(false)} selectedStudents={students} setSelectedStudents={setStudents} />
        </>
    );
};
