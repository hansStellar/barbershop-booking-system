import axios from "axios";

const BASE_URL = "http://localhost:8000/store";

export async function Get_Store_Settings() {
  try {
    const response = await axios.get(`${BASE_URL}/get_settings`);
    return response.data;
  } catch (error) {
    console.error("Error fetching store settings:", error);
  }
}

export async function Update_Store_Hours(opening_time, closing_time) {
  try {
    const response = await axios.put(`${BASE_URL}/update_hours`, {
      opening_time,
      closing_time,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating store hours:", error);
  }
}

export async function Add_Holiday(date) {
  try {
    const response = await axios.put(`${BASE_URL}/add_holiday`, {
      date,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding holiday:", error);
  }
}

export async function Remove_Holiday(date) {
  try {
    const response = await axios.put(`${BASE_URL}/remove_holiday`, {
      date,
    });
    return response.data;
  } catch (error) {
    console.error("Error removing holiday:", error);
  }
}
