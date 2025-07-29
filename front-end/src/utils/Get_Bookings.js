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
