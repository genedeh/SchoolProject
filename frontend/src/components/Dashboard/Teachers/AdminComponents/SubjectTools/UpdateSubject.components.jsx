import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import useSubjects from "../../../../../contexts/Subjects.contexts";
import { TeacherSelectPopUp } from "../SelectPopUps/SubjectTeacherSelectPopupComponent";
import { StudentsSelectPopUp } from "../SelectPopUps/SubjectStudentsSelectPopupComponent";
import axios from 'axios';

export const UpdateSubjectModal = ({ show, handleClose, subject }) => {
    const { refetchNewData } = useSubjects();
    const [name, setName] = useState('');
    const [assignedTeacher, setAssignedTeacher] = useState(null);
    const [students, setStudents] = useState([]);
    const [listShow, setListShow] = useState(false);
    const [listShow2, setListShow2] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [updated, setUpdated] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show) {
            if (subject) {
                setName(subject.name);
                try {
                    setAssignedTeacher(subject.assigned_teacher || '');
                } catch (error) {
                    setAssignedTeacher(null)
                }

                setStudents(subject.students_offering);
            }
        }
    }, [show]);

    const updateSubjectCloseHandler = () => {
        setLoading(false)
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token")
        setUpdated(false);
        setError(null);
        setSuccess(null);

        if (!token) {
            throw new Error("Authentication token is missing!");
        }
        if (name.length < 100 && name.length !== 0) {
            try {
                const data = {
                    name,
                    assigned_teacher: assignedTeacher.id,
                    students_offering: students.map((student) => {
                        return student.id
                    }),
                }
                await axios.put(`api/subjects/${subject.id}/`, data,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                )
                    .then(() => {
                        setSuccess('Subject updated successfully.');
                        console.log(success);
                        setUpdated(true);
                        setLoading(false);
                        updateSubjectCloseHandler();
                    });

            } catch (error) {
                setError('Failed to update subject.');
                setLoading(false);
            }
        } else {
            setError('Subject Name Exceeds Max Length.');
            setLoading(false);
        }
    };

    return (
        <>
            <Modal show={show} fullscreen scrollable onHide={() => {
                if (!loading) {
                    updateSubjectCloseHandler();
                    handleClose();
                    if (updated) {
                        refetchNewData();
                    }
                }
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Subject</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form >
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
                    <hr />
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={(e) => {
                        setLoading(true);
                        handleUpdate(e);
                    }} disabled={loading} type='submit'>
                        {loading ? 'Updating subject...' : 'Update Subject'}
                    </Button>
                </Modal.Footer>
            </Modal>
            <TeacherSelectPopUp show={listShow} handleClose={() => setListShow(false)} selectedTeacher={assignedTeacher} setSelectedTeacher={setAssignedTeacher} />
            <StudentsSelectPopUp show={listShow2} handleClose={() => setListShow2(false)} selectedStudents={students} setSelectedStudents={setStudents} />
        </>
    );
};
