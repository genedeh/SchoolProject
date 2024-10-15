import { Alert } from 'react-bootstrap';
import { CheckCircleFill } from 'react-bootstrap-icons';

const SuccessAlert = ({ message }) => (
    <Alert variant="success" className="d-flex align-items-center">
        <CheckCircleFill size={32} className="me-3" />
        <div>
            <h5 className="mb-1">This is success message</h5>
            <p>{message}</p>
        </div>
    </Alert>
);

export default SuccessAlert;
