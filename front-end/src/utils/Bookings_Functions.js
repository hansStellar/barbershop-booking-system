import axios from "axios";

export async function Get_Bookings() {
  try {
    const response = await axios.get(
      "http://localhost:8000/bookings/get_bookings",
    );
    return response;
  } catch (error) {
    const message = error.message;
    throw new Error(`Failed to retrieve data: ${message}`);
  }
}

export async function Post_Booking(value) {
  try {
    // Send booking data to the backend
    const response = axios.post(
      "http://localhost:8000/bookings/send_book",
      value,
    );

    // Return the backend response
    return response.data;
  } catch (error) {
    // Axios errors have a .response object
    const message = error.response?.data || error.message;
    throw new Error(`Failed to book: ${message}`);
  }
}
