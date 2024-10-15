import { Alert } from 'react-bootstrap';
import { CheckCircleFill } from 'react-bootstrap-icons';
import './Alert.styles.css';

const SuccessAlert = ({ message, heading }) => (
    <Alert variant="success" className="alert-container">
        <CheckCircleFill className="alert-icon" />
        <div>
            <h5 className="alert-heading">{heading}</h5>
            <p className='alert-text'>{message}</p>
        </div>
    </Alert>
);

export default SuccessAlert;
