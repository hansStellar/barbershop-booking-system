import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const API_BASE = "http://localhost:8000";

export async function Get_All_Products() {
  try {
    const response = await axios.get(`${API_BASE}/shop_products/get_products`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching all products:",
      error.response?.data || error.message,
    );
    throw error;
  }
}

export async function Get_Products_By_Category_ID(category_id) {
  try {
    const response = await axios.get(
      `${API_BASE}/shop_products/get_products_by_category_id/${category_id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response;
  } catch (error) {
    console.error(
      "Error reading products:",
      error.response?.data || error.message,
    );
  }
}

export async function Create_Product(new_product) {
  try {
    new_product.id = uuidv4();
    const response = await axios.post(
      `${API_BASE}/shop_products/create_product`,
      new_product,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating product:",
      error.response?.data || error.message,
    );
    throw error;
  }
}

export async function Update_Product(product_id, updated_product) {
  try {
    const response = await axios.put(
      `${API_BASE}/shop_products/update_product/${product_id}`,
      updated_product,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error updating product ${product_id}:`,
      error.response?.data || error.message,
    );
    throw error;
  }
}

export async function Delete_Product(product_id) {
  try {
    const response = await axios.delete(
      `${API_BASE}/shop_products/delete_product/${product_id}`,
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error deleting product ${product_id}:`,
      error.response?.data || error.message,
    );
    throw error;
  }
}

export async function Delete_Products(products) {
  try {
    const response = products.map((product) =>
      axios.delete(`${API_BASE}/shop_products/delete_product/${product.id}`),
    );

    return response;
  } catch (error) {
    console.error(
      `Error deleting products:`,
      error.response?.data || error.message,
    );
    throw error;
  }
}
