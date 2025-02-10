export const ErrorMessageHandling = (isError, error) => {
    let errorMessage = "";
    if (isError) {
        if (error.response) {
            // Server responded with a status code outside the 2xx range
            switch (error.response.status) {
                case 404:
                    errorMessage = "Data not found (404).";
                    break;
                case 500:
                    errorMessage = "Server error (500). Please try again later.";
                    break;
                case 401:
                    errorMessage = "Unauthorized (401). Please Login.";
                    break;
                default:
                    errorMessage = `Unexpected error: ${error.response.status}`;
            }
        } else if (error.request) {
            // Request was made but no response was received
            errorMessage = "Network error. Please check your connection.";
        } else {
            // Something happened setting up the request
            console.log(error)
            errorMessage = `Error: ${error.message}`;
        }
    }
    return errorMessage
}