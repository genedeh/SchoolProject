import { Alert } from 'react-bootstrap';
import { ExclamationCircleFill } from 'react-bootstrap-icons';

const ErrorAlert = ({ message, errorType }) => (
    <Alert variant="danger" className="d-flex align-items-center">
        <ExclamationCircleFill size={32} className="me-3" />
        <div>
            <h5 className="mb-1">This is{errorType == "404" ? (" a 404 error message") : (" error message") }</h5>
            <p>{message}</p>
        </div>
    </Alert>
);

export default ErrorAlert;
