import { Modal, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { useClassrooms } from '../../../../../contexts/Classrooms.contexts';
import axios from 'axios';

export const DeleteClassroomModal = ({ show, handleClose, classroomId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { refetchNewData } = useClassrooms();


    const handleDelete = async () => {
        const token = localStorage.getItem("token")
        setError(null);
        if (!token) {
            throw new Error("Authentication token is missing!");
        }
        try {
            setLoading(true);
            await axios.delete(`api/classrooms/${classroomId}/`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            handleClose();
            setError(null);
            refetchNewData();
        } catch (error) {
            setError('Failed to delete classroom');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show}>
            {error && <Alert variant="danger m-2" dismissible onClose={() => setError(null)}>{error}</Alert>}
            <Modal.Header >
                <Modal.Title>Delete Classroom</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete this classroom?
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
    );
};