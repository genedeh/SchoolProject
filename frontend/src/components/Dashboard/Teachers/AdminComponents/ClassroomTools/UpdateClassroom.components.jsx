import { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { UsersListContext } from "../../../../../contexts/UsersList.contexts";
import { ClassroomsContext } from "../../../../../contexts/Classrooms.contexts";
import { ClassRoomTeacherSelectPopUp } from '../SelectPopUps/ClassroomTeacherSelectPopupComponent';
import { ClassroomStudentsSelectPopUp } from '../SelectPopUps/ClassroomStudentsSelectPopupComponent';
import axios from 'axios';

export const UpdateClassroomModal = ({ show, handleClose, classroom }) => {
    const { refresh, setRefresh } = useContext(UsersListContext);
    const { setClassrooms } = useContext(ClassroomsContext);
    const [name, setName] = useState('');
    const [assignedTeacher, setAssignedTeacher] = useState(null);
    const [students, setStudents] = useState([]);
    const [listShow, setListShow] = useState(false);
    const [listShow2, setListShow2] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (name.length < 8 && name.length !== 0) {
            try {
                const data = {
                    name,
                    assigned_teacher: assignedTeacher.id,
                    students: students.map((student) => {
                        return student.id
                    }),
                }
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
        } else {
            setError('Class Name Exceeds Max Length.')
        }
    };

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Classroom</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
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
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleUpdate}>
                        Update Classroom
                    </Button>
                </Modal.Footer>
            </Modal>
            <ClassRoomTeacherSelectPopUp show={listShow} handleClose={() => setListShow(false)} selectedTeacher={assignedTeacher} setSelectedTeacher={setAssignedTeacher} />
            <ClassroomStudentsSelectPopUp show={listShow2} handleClose={() => setListShow2(false)} selectedStudents={students} setSelectedStudents={setStudents} />
        </>
    );
};
