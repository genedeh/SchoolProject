import { Modal, Button } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { SubjectsContext } from '../../../../../contexts/Subjects.contexts';
import axios from 'axios';

export const DeleteSubjectModal = ({ show, handleClose, subjectId }) => {
    const [deleteStatus, setDeleteStatus] = useState(null);
    const { subjects, setSubjects } = useContext(SubjectsContext);

    const handleDelete = async () => {
        try {
            await axios.delete(`api/subjects/${subjectId}/`);
            setDeleteStatus("success");
            setSubjects(subjects.filter(subject => subject.id !== subjectId));
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
                                <Modal.Title>Delete Subject</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Are you sure you want to delete this subject?
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
                                ? "The subject was deleted successfully."
                                : "Failed to delete the subject."}
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