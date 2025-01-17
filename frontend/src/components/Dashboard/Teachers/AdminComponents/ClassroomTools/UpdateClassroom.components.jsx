import { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useClassrooms } from "../../../../../contexts/Classrooms.contexts";
import { ClassRoomTeacherSelectPopUp } from '../SelectPopUps/ClassroomTeacherSelectPopupComponent';
import { ClassroomStudentsSelectPopUp } from '../SelectPopUps/ClassroomStudentsSelectPopupComponent';
import axios from 'axios';

export const UpdateClassroomModal = ({ show, handleClose, classroom }) => {
    const { refetchNewData } = useClassrooms();
    const [name, setName] = useState('');
    const [assignedTeacher, setAssignedTeacher] = useState(null);
    const [students, setStudents] = useState([]);
    const [listShow, setListShow] = useState(false);
    const [listShow2, setListShow2] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [updated, setUpdated] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show) {
            if (classroom) {
                setName(classroom.name);
                try {
                    setAssignedTeacher(classroom.assigned_teacher || '');
                } catch (error) {
                    setAssignedTeacher(null)
                }

                setStudents(classroom.students);
            }
        }
    }, [show]);

    const updateClassroomCloseHandler = () => {
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
        if (name.length < 8 && name.length !== 0) {
            try {
                const data = {
                    name,
                    assigned_teacher: assignedTeacher.id,
                    students: students.map((student) => {
                        return student.id
                    }),
                }
                await axios.put(`api/classrooms/${classroom.id}/`, data,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                )
                    .then(() => {
                        setSuccess('Classroom updated successfully.');
                        console.log(success);
                        setUpdated(true);
                        setLoading(false);
                        updateClassroomCloseHandler();
                    });

            } catch (error) {
                setError('Failed to update classroom.');
                setLoading(false);
            }
        } else {
            setError('Class Name Exceeds Max Length.');
            setLoading(false);
        }
    };

    return (
        <>
            <Modal show={show} fullscreen scrollable onHide={() => {
                if (!loading) {
                    updateClassroomCloseHandler();
                    handleClose();
                    if (updated) {
                        refetchNewData();
                    }
                }
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Classroom</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
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
                        <br />
                        {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
                        {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={(e) => {
                        setLoading(true);
                        handleUpdate(e);
                    }} disabled={loading} type='submit'>
                        {loading ? 'Updating classroom...' : 'Update Classroom'}
                    </Button>
                </Modal.Footer>
            </Modal>
            <ClassRoomTeacherSelectPopUp show={listShow} handleClose={() => setListShow(false)} selectedTeacher={assignedTeacher} setSelectedTeacher={setAssignedTeacher} />
            <ClassroomStudentsSelectPopUp show={listShow2} handleClose={() => setListShow2(false)} selectedStudents={students} setSelectedStudents={setStudents} />
        </>
    );
};
