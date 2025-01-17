import React from 'react';
import { Spinner } from 'react-bootstrap';

export const CenteredSpinner = ({ caption }) => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh', // Full height of the viewport
                flexDirection: 'column',
            }}
        >
            <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p style={{ marginTop: '1rem', fontWeight: '500' }}>{caption}</p>
        </div>
    );
};

export default CenteredSpinner;
