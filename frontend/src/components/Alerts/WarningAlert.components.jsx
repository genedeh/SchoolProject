import { Alert } from 'react-bootstrap';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';
import './Alert.styles.css';

const WarningAlert = ({ message, heading, children }) => (
    <Alert variant="warning" className="alert-container">
        <ExclamationTriangleFill className="alert-icon" />
        <div>
            <h5 className="alert-heading">{heading}</h5>
            <p className="alert-text">{message}</p>
            {children}
        </div>
    </Alert>
);

export default WarningAlert;
