import axios from "axios";

export async function Get_Services() {
  try {
    const response = await axios.get(
      "http://localhost:8000/services/get_services",
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function Create_Service(serviceData) {
  try {
    const response = await axios.post(
      "http://localhost:8000/services/create_service",
      serviceData,
    );
    return response;
  } catch (error) {
    throw error;
  }
}
