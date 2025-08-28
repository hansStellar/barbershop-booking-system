import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const API_BASE = "http://localhost:8000";

export async function Get_Category(category_id) {
  try {
    const response = await axios.get(
      `${API_BASE}/shop/categories/${category_id}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
}

export async function Get_Categories() {
  try {
    const response = await axios.get(
      `${API_BASE}/shop_categories/get_categories`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function Create_Category(new_category) {
  try {
    new_category.id = uuidv4();
    const response = await axios.post(
      `${API_BASE}/shop_categories/create_category`,
      new_category,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

export async function Update_Category(category) {
  try {
    const response = await axios.put(
      `${API_BASE}/shop_categories/update_category/${category.id}`,
      category,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

export async function Delete_Category(category_id) {
  try {
    const response = await axios.delete(
      `${API_BASE}/shop_categories/delete_category/${category_id}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}
