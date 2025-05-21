import { Modal } from 'react-bootstrap';
import { ExclamationCircleFill } from 'react-bootstrap-icons';
import './Alert.styles.css';
import { useState } from 'react';
export const ErrorAlert = ({ message, heading, removable=true, children }) => {
    const [show, setShow] = useState(true)

    return (
        <Modal
            show={show}
            onHide={()=>setShow(false)}
            centered
            backdrop="static"
            keyboard={false}
            className="custom-alert-modal"
        >
            <Modal.Header className='alert-text-danger alert-text' closeButton={removable}>
                <h5 >{heading}</h5>
            </Modal.Header>
            <Modal.Body className="custom-alert-body">
                <div className="alert-content">
                    <div className="alert-icon-danger">
                        <ExclamationCircleFill />
                    </div>
                    <div className="alert-text-danger alert-text">
                        <p>{message}</p>
                        <p>{children}</p>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
};

