import { useState } from "react";
import { Modal, ListGroup, Button } from "react-bootstrap";
import { ResultModal } from "./ResultModal.components";

export const ResultTermModal = ({ showOverlay, setShowOverlay,  studentResult }) => {
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [showResultModal, setShowResultModal] = useState(false);
    return (
        <>
            <Modal
                show={showOverlay}
                onHide={() => setShowOverlay(false)}
                centered
                backdrop="static"
                keyboard={false}
                className="fade"
            >
                {/* Modal Background Blur Effect */}
                <div className="modal-backdrop-blur"></div>

                <Modal.Header className="text-white" closeButton>
                    <Modal.Title>📜 Available Terms</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <ListGroup variant="flush">
                        {studentResult?.terms &&
                            Object.entries(studentResult.terms).map(([termName, termArray]) => {
                                const term = termArray[0]; // Get first term object
                                if (!term.uploaded) return (
                                    <ListGroup.Item key={termName} className="border-0 text-center">
                                        <Button variant="outline-secondary" className="w-100 fw-bold custom-btn4" onClick={() => {
                                            setSelectedTerm(termArray)
                                            setShowResultModal(true)
                                        }}>
                                            {termName} (Not Uploaded)
                                        </Button>
                                    </ListGroup.Item>
                                );; // Hide if not uploaded

                                return (
                                    <ListGroup.Item key={termName} className="border-0 text-center">
                                        <Button variant="dark" className="w-100 fw-bold custom-btn2" onClick={() => {
                                            setSelectedTerm(termArray)
                                            setShowResultModal(true)
                                        }}>
                                            {termName}
                                        </Button>
                                    </ListGroup.Item>
                                );
                            })}
                        {!studentResult?.terms && (
                            <p className="text-muted text-center">No Terms Available</p>
                        )}
                    </ListGroup>
                </Modal.Body>
            </Modal>
            <ResultModal show={showResultModal} handleClose={() => setShowResultModal(false)} result={selectedTerm} />
        </>
    );
}