import { Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import './LoadingOverlay.styles.css';

export const LoadingOverlay = ({ loading, message = "Please wait...", timeout = 10000 }) => {
    const [longLoading, setLongLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLongLoading(true);
        }, timeout);

        return () => clearTimeout(timer);
    }, [timeout]);

    if (!loading) return null;

    return (
        <Modal show={loading} centered backdrop="static" keyboard={false} className="loading-modal">
            <Modal.Body className="loading-content">
                <div className="hexagon-animation">
                    {/* Hexagons */}
                    <div className="hexagon hex1"><i className="bi bi-check2"></i></div>
                    <div className="hexagon hex2"><i className="bi bi-check2"></i></div>
                    <div className="hexagon hex3"><i className="bi bi-check2"></i></div>
                    <div className="hexagon hex4"><i className="bi bi-check2"></i></div>
                    <div className="hexagon hex5"><i className="bi bi-check2"></i></div>
                    <div className="hexagon hex6"><i className="bi bi-check2"></i></div>
                </div>
                <h5 >{message}</h5>
                <div className="progress-bar">
                    <div className="progress-bar-inner"></div>
                </div>
                {longLoading && <p style={{ "color": "black" }}>This is taking longer than expected could be a network issue please have patience...</p>}
            </Modal.Body>
        </Modal>
    );
};

