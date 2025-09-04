import axios from "axios";

export async function Create_Employer(employerData) {
  try {
    const response = await axios.post(
      "http://localhost:8000/employers/create_employer",
      employerData,
    );
    return response;
  } catch (error) {
    const message = error.message;
    throw new Error(`Failed to retrieve data: ${message}`);
  }
}

export async function Get_Employers() {
  try {
    const response = await axios.get(
      "http://localhost:8000/employers/get_employers",
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch employers");
  }
}
