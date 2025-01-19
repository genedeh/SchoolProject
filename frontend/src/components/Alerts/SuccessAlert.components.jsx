import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { CheckCircleFill } from 'react-bootstrap-icons';
import './Alert.styles.css';

export const SuccessAlert = ({ message, heading, children }) => {
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
            <Modal.Header className='alert-text-success alert-text' closeButton>
                <h5 >{heading}</h5>
            </Modal.Header>
            <Modal.Body className="custom-alert-body">
                <div className="alert-content">
                    <div className="alert-icon-success">
                        <CheckCircleFill />
                    </div>
                    <div className="alert-text-success alert-text">
                        <p>{message}</p>
                        <p>{children}</p>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
};
