import { Alert } from 'react-bootstrap';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';

const WarningAlert = ({ message }) => (
    <Alert variant="warning" className="d-flex align-items-center">
        <ExclamationTriangleFill size={32} className="me-3" />
        <div>
            <h5 className="mb-1">This is warning message</h5>
            <p>{message}</p>
        </div>
    </Alert>
);

export default WarningAlert;
