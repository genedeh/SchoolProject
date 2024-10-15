import { Alert } from 'react-bootstrap';
import { ExclamationCircleFill } from 'react-bootstrap-icons';
import './Alert.styles.css';
const ErrorAlert = ({ message, heading }) => (
    <Alert variant="danger" className="alert-container">
        <ExclamationCircleFill className="alert-icon" />
        <div>
            <h5 className="alert-heading">{heading}</h5>
            <p className="alert-text">{message}</p>
        </div>
    </Alert>
);

export default ErrorAlert;
