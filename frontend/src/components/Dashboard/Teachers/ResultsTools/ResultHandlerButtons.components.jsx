import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { EyeFill, PlusCircleFill } from "react-bootstrap-icons";
import { FaStar } from "react-icons/fa";

export const ResultViewHandlerButton = ({ queryKeys, refetch, setSelectedStudent, selectedStudent, id, loading }) => {
    return (
        <Button
            size="sm"
            variant="outline-dark"
            onClick={() => {
                setSelectedStudent({ ...queryKeys });
                // Show loading spinner before fetching
                refetch();
            }}
            disabled={loading.isFetchingResult && loading.isLoadingResult && selectedStudent?.studentId === id}
        >
            {loading.isFetchingResult && selectedStudent?.studentId === id ? (
                <Spinner animation="border" size="sm" />
            ) : (
                <>
                    <EyeFill className="me-1" /> View Result
                </>
            )}
        </Button>
    );
}

export const ResultCreationHandlerButton = ({ studentName, classroomID }) => {
    return (
        <>
            < Button
                size="sm"
                variant="outline-success"
                onClick={() => {
                    const url = `/dashboard/create-student-result/?student_name=${studentName}&classroom_id=${classroomID}`;
                    window.open(url, "_blank"); // Open in new tab
                }}
                className="me-2"
            > <PlusCircleFill className="me-1" /> Add Result</Button >
        </>
    );
}


export const StarRating = ({ value, onChange }) => {
    const [rating, setRating] = useState(value || 0);

    const handleClick = (index) => {
        const newRating = index + 1 === rating ? 0 : index + 1;
        setRating(newRating);
        onChange(newRating);
    };

    return (
        <div>
            {[...Array(5)].map((_, index) => (
                <FaStar
                    key={index}
                    size={24}
                    color={index < rating ? "#ffc107" : "#e4e5e9"}
                    onClick={() => handleClick(index)}
                    style={{ cursor: "pointer", marginRight: 5 }}
                />
            ))}
        </div>
    );
};