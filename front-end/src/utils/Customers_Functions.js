import axios from "axios";

export async function Get_Customers() {
  try {
    const response = axios.get("http://localhost:8000/customers/get_customers");
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function Get_Customer(customer_email) {
  try {
    const response = axios.post(
      "http://localhost:8000/customers/get_customer",
      { customer_email },
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function Create_Customer(customer_form_data) {
  // Variables
  const { name, email, number } = customer_form_data;

  try {
    // 1 - Check if the customer exists
    const customer = await Get_Customer(email); // asegúrate que Get_Customers reciba el email como parámetro

    if (customer?.data.customer_found === false) {
      // 1.2 If customer doesn't exist, create it
      try {
        const response = await axios.post(
          "http://localhost:8000/customers/create_customer",
          {
            name,
            email,
            number,
            customer_id: crypto.randomUUID(), // o cualquier ID que estés usando
            orders: 1,
            its_registered: false,
          },
        );
        console.log("New customer created:", response.data);
      } catch (error) {
        console.error("Error creating customer:", error);
      }
    } else {
      // 1.1 If customer exists, update their order count
      try {
        const updatedOrders = parseInt(customer.data.orders || 0) + 1;
        const response = await axios.put(
          "http://localhost:8000/customers/update_customer",
          {
            email,
            orders: updatedOrders,
          },
        );
        console.log("Customer order count updated:", response.data);
      } catch (error) {
        console.error("Error updating customer:", error);
      }
    }
  } catch (error) {
    console.error("Error fetching customer:", error);
  }
}

export async function Delete_Customers() {}
