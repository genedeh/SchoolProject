export const ErrorMessageHandling = (isError, error) => {
    if (!isError || !error) return "";

    let errorMessage = "An unexpected error occurred. Please try again.";

    if (error.response) {
        // Server responded with a status code outside the 2xx range
        const { status, data } = error.response;
        
        if (data && data.detail) {
            // If API provides a specific error message
            errorMessage = data.detail;
        } else {
            switch (status) {
                case 400:
                    errorMessage = "Bad request. Please check your input.";
                    break;
                case 401:
                    errorMessage = "Unauthorized. Please log in to continue.";
                    break;
                case 403:
                    errorMessage = "Forbidden. You don't have permission to access this resource.";
                    break;
                case 404:
                    errorMessage = "Requested resource not found (404).";
                    break;
                case 500:
                    errorMessage = "Internal server error (500). Please try again later.";
                    break;
                default:
                    errorMessage = `Unexpected error: (${status}). Please try again.`;
            }
        }
    } else if (error.request) {
        // Request was made but no response was received
        errorMessage = "Network error. Please check your connection and try again.";
    } else {
        // Something happened setting up the request
        console.error("Error Log:", error);
        errorMessage = `Error: ${error.message}`;
    }

    return errorMessage;
};
