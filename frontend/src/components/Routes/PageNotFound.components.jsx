import React from "react";
import { Container, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import notfound404 from "../../assets/notfound404.jpg";
const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Container className="text-center d-flex flex-column align-items-center justify-content-center vh-100">
            <Image src={notfound404} alt="Not Found" width="500" className="mb-4" />
            <h2 className="fw-bold text-dark">Oops,</h2>
            <p className="text-muted">There is no result for your search. Try again!</p>
            <Button variant="primary" onClick={() => navigate("/")}>
                Go Home
            </Button>
        </Container>
    );
};

export default NotFound;
