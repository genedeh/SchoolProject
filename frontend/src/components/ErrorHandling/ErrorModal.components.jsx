import { Modal } from "react-bootstrap";
import ErrorAlert from '../Alerts/ErrorAlert.components'

export const ErrorModal = ({ errorMessage, show, handleClose, children }) => {
    return (
        <Modal show={show} onHide={handleClose} centered style={{ 'borderRadius': '3rem' }}>
            <ErrorAlert heading={errorMessage[0]} message={errorMessage[1]} ></ErrorAlert>
            {children}
        </Modal>
    );
}