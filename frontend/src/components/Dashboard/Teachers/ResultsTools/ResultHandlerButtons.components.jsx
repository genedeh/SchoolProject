import { Button, Spinner } from "react-bootstrap";
import { EyeFill } from "react-bootstrap-icons";

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

export const ResultCreationHandlerButton = ({ }) => {
    return (
        <div></div>
    );
}

