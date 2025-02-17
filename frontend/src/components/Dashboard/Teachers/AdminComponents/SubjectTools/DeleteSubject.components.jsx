import { Modal, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';
import useSubjects from '../../../../../contexts/Subjects.contexts';
import axios from 'axios';

export const DeleteSubjectModal = ({ show, handleClose, subjectId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { refetchNewData } = useSubjects();

    const handleDelete = async () => {
        const token = localStorage.getItem("token")
        setError(null);
        if (!token) {
            throw new Error("Authentication token is missing!");
        }
        try {
            setLoading(true);
            await axios.delete(`api/subjects/${subjectId}/`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            handleClose();
            setError(null);
            refetchNewData();
        } catch (error) {
            setError('Failed to delete subject');
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <Modal show={show}>
                {error && <Alert variant="danger m-2" dismissible onClose={() => setError(null)}>{error}</Alert>}
                <Modal.Header >
                    <Modal.Title>Delete Subject</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this subject?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        if (!loading) {
                            setError(null);
                            handleClose();
                        }
                    }}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete} disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};