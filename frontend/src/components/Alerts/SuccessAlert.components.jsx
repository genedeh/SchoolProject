import { Alert } from 'react-bootstrap';
import { CheckCircleFill } from 'react-bootstrap-icons';
import './Alert.styles.css';

export const SuccessAlert = ({ message, heading, children }) => (
    <Alert variant="success" className="alert-container">
        <CheckCircleFill className="alert-icon" />
        <div>
            <h5 className="alert-heading">{heading}</h5>
            <p className='alert-text'>{message}</p>
            {children}
        </div>
    </Alert>
);
