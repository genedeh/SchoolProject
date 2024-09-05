import { Modal, Button } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { ClassroomsContext } from '../../../../../contexts/Classrooms.contexts';
import axios from 'axios';

export const DeleteClassroomModal = ({ show, handleClose, classroomId }) => {
    const [deleteStatus, setDeleteStatus] = useState(null);
    const { classrooms, setClassrooms } = useContext(ClassroomsContext);

    const handleDelete = async () => {
        try {
            await axios.delete(`api/classrooms/${classroomId}/`);
            setDeleteStatus("success");
            setClassrooms(classrooms.filter(subject => subject.id !== classroomId));
        } catch (error) {
            setDeleteStatus("failed");
        }
    };


    return (
        <>
            <Modal show={show} onHide={() => {
                handleClose()
                setDeleteStatus(null);
            }}>
                {deleteStatus == null ?
                    (
                        <>
                            <Modal.Header closeButton>
                                <Modal.Title>Delete Classroom</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Are you sure you want to delete this classroom?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button variant="danger" onClick={handleDelete}>
                                    Delete
                                </Button>
                            </Modal.Footer>
                        </>) :
                    (<>
                        <Modal.Header closeButton>
                            <Modal.Title>{deleteStatus === "success" ? "Success" : "Error"}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {deleteStatus === "success"
                                ? "The classroom was deleted successfully."
                                : "Failed to delete the classroom."}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={() => {
                                handleClose()
                                setDeleteStatus(null);
                            }}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </>)}

            </Modal>
        </>
    );
};