import { Modal, Button } from 'react-bootstrap';
import { ExclamationCircleFill } from 'react-bootstrap-icons';
import './Alert.styles.css';
import { useState } from 'react';
export const ErrorAlert = ({ message, heading, children }) => {
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
                    <div className="alert-icon-danger">
                        <ExclamationCircleFill />
                    </div>
                    <div className="alert-text-danger alert-text">
                        <h5>{heading}</h5>
                        <p>{message}</p>
                        <p>{children}</p>
                    </div>
                </div>
            </Modal.Body>
                <Button variant="outline-danger" onClick={onClose} className="close-btn">
                    Close
                </Button>
        </Modal>
    )
};

