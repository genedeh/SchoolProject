import { Modal, Alert } from "react-bootstrap";

export const ErrorModal = ({ errorMessage, show, handleClose, children }) => {
    return (
        <Modal show={show} onHide={handleClose} centered style={{ 'borderRadius': '3rem'}}>
            <Modal.Header closeButton >
                <Modal.Title style={{ 'color': 'red', 'textAlign': 'center' }} className="m-2" >--{errorMessage[0]}--</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center"  >
                <Alert variant="danger" >&#9888;{errorMessage[1]}&#9888;</Alert>
                {children}
            </Modal.Body>
        </Modal>
    );
}