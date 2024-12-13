import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';
import './Alert.styles.css';

export const WarningAlert = ({ message, heading, children }) => {
    const [show, setShow] = useState(true)
    const onClose = () => {
        setShow(false)
    }
    return (
        <Modal
            show={show}
            onHide={onClose}
            centered
            backdrop="static"
            keyboard={false}
            className="custom-alert-modal"
        >
            <Modal.Body className="custom-alert-body">
                <div className="alert-content">
                    <div className="alert-icon-warning">
                        <ExclamationTriangleFill />
                    </div>
                    <div className="alert-text-warning alert-text">
                        <h5>{heading}</h5>
                        <p>{message}</p>
                        <p>{children}</p>
                    </div>
                </div>
            </Modal.Body>
            <Button variant="outline-warning" onClick={onClose} className="close-btn">
                Close
            </Button>
        </Modal>
    )
};

