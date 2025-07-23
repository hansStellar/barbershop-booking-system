import axios from "axios"

export async function Booking_Function(value) {
    try {
        // Send booking data to the backend
        const response = axios.post("http://localhost:8000/bookings/send_book", value)
    
        // Return the backend response
        return response.data;   
    } catch (error) {
        // Axios errors have a .response object
        const message = error.response?.data || error.message;
        throw new Error(`Failed to book: ${message}`);
    }
}